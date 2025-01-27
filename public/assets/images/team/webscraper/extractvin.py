import time
import random
import json 
from undetected_chromedriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException
from selenium.common.exceptions import TimeoutException, NoSuchElementException

options = ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("--disable-extensions")
options.add_argument("--disable-infobars")
options.add_argument("--disable-web-security")
options.add_argument("--allow-running-insecure-content")
options.add_argument("--incognito")  # Add incognito mode


# Set a random User-Agent string
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edge/91.0.864.59"
]
options.add_argument(f"user-agent={random.choice(user_agents)}")

def slow_typing(text, element, delay=0.5):
    """Simulates human typing by typing one character at a time."""
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.1, delay))  # Mimic random typing speed

# Path to ChromeDriver
driver = Chrome(options=options, driver_executable_path="./chromedriver.exe")

# Load the result.json file
def load_result_file():
    try:
        with open("result.json", "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        print("result.json not found or invalid. Make sure the file exists and is formatted correctly.")
        return []

# Save to vin.json
def save_to_vin_file(data):
    try:
        with open("vin.json", "r") as file:
            existing_data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = []

    existing_data.extend(data)

    with open("vin.json", "w") as file:
        json.dump(existing_data, file, indent=4)
    print("Data appended to vin.json.")

# Main function
def process_stock_numbers():
    # Load result.json
    results = load_result_file()
    if not results:
        print("No data found in result.json.")
        return


    vin_data = []

    try:
        for obj in results:
            
            # Skip if bid is empty
            bid = obj.get("Final_Bid", "")
            if bid == "":
                print(f"Skipping object with empty bid: {obj}")
                continue
            
            stock_number_href = obj.get("stock_number_href")
            if not stock_number_href:
                print("No stock_number_href found for object:", obj)
                continue

            print(f"Opening URL: {stock_number_href}")
            driver.get(stock_number_href)

            try:
                # Wait for the page to load and look for the VIN span
                vin_element = WebDriverWait(driver, 20).until(
                    EC.presence_of_element_located((By.XPATH, "//span[@id='VIN_VehInfo']/following-sibling::span"))
                )
                vin_number = vin_element.text
                print(f"VIN number found: {vin_number}")

                # Append VIN data to the result
                obj["vin_number"] = vin_number
                vin_data.append(obj)

            except TimeoutException:
                print(f"VIN information not found for {stock_number_href}.")
            except Exception as e:
                print(f"Error extracting VIN for {stock_number_href}: {e}")

    finally:
        # Close the browser
        print("Closing browser...")
        driver.quit()

    # Save all extracted VIN data to vin.json
    save_to_vin_file(vin_data)

# Run the script
if __name__ == "__main__":
     # Open Google
    print("Opening Google...")
    driver.get("https://www.google.com")
    time.sleep(random.uniform(2, 4))
    # Navigate to IAAI
    print("Navigating to IAAI...")
    driver.get("https://iaai.com")
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )

    # Click the "Log In" button
    print("Clicking on Login...")
    log_in_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id='loginRow']/div[1]/a[2]"))
    )
    log_in_button.click()
    time.sleep(random.uniform(1, 2))

    # Wait for email and password fields
    print("Waiting for login fields...")
    email_field = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "Email"))
    )
    password_field = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "Password"))
    )
    print("Entering email and password...")
    slow_typing("khana@hawkmail.hfcc.edu", email_field)
    time.sleep(random.uniform(1, 2))
    slow_typing("karam2002", password_field)

    # Click the login button
    print("Logging in...")
    login_button = WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and contains(@class, 'btn-primary')]")))
    login_button.click()
    time.sleep(random.uniform(2, 4))
    print("Logged in...")
    time.sleep(15)
    process_stock_numbers()
