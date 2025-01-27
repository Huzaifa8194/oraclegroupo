
import os
import time
import random
import json
from undetected_chromedriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# Chrome options setup
options = ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("--disable-extensions")
options.add_argument("--disable-infobars")
options.add_argument("--incognito")

# Random User-Agent
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edge/91.0.864.59"
]
options.add_argument(f"user-agent={random.choice(user_agents)}")

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

# Process stock numbers
def process_stock_numbers(driver):
    results = load_result_file()
    if not results:
        print("No data found in result.json.")
        return

    vin_data = []
    for obj in results:
        stock_number_href = obj.get("stock_number_href")
        if not stock_number_href:
            print("No stock_number_href found for object:", obj)
            continue

        print(f"Opening URL: {stock_number_href}")
        driver.get(stock_number_href)

        try:
            # Wait for the VIN span
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

    save_to_vin_file(vin_data)

# Monitor file changes
def monitor_file(driver):
    last_modified_time = os.path.getmtime("result.json")
    while True:
        time.sleep(5)  # Check every 5 seconds
        try:
            current_modified_time = os.path.getmtime("result.json")
            if current_modified_time != last_modified_time:
                print("result.json has been updated. Processing new data...")
                process_stock_numbers(driver)
                last_modified_time = current_modified_time
        except FileNotFoundError:
            print("result.json not found. Waiting for the file to be created...")

# Main function
if __name__ == "__main__":
    driver = Chrome(options=options, driver_executable_path="./chromedriver.exe")
    try:
            # Log in to the website
        print("Logging into the website...")
        driver.get("https://iaai.com")
        login_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='loginRow']/div[1]/a[2]"))
        )
        login_button.click()

        # Fill login form
        email_field = WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.ID, "Email")))
        password_field = WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.ID, "Password")))
        slow_typing("khana@hawkmail.hfcc.edu", email_field)
        slow_typing("karam2002", password_field)

        # Submit the login form
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and contains(@class, 'btn-primary')]"))
        ).click()

        print("Login successful. Navigating to auction page...")
        driver.get("https://iaai.com/LiveAuctionsCalendar")
        time.sleep(15)  # Simulate login if required

        # Start monitoring result.json
        print("Monitoring result.json for changes...")
        monitor_file(driver)

    finally:
        print("Closing browser...")
        driver.quit()
