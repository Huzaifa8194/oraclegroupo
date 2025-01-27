import time
import random
import json
from undetected_chromedriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException

# Set up Chrome options
options = ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("--disable-extensions")
options.add_argument("--disable-infobars")
options.add_argument("--disable-web-security")
options.add_argument("--allow-running-insecure-content")
options.add_argument("--incognito")  # Add incognito mode

# Set a random User-Agent string
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/116.0.1938.69"
]

options.add_argument(f"user-agent={random.choice(user_agents)}")

def wait_for_loader_to_disappear(driver, timeout=300):
    try:
        WebDriverWait(driver, timeout).until(
            lambda d: not d.find_element(By.CLASS_NAME, "loader__shape").is_displayed()
        )
        print("Loader disappeared.")
    except (TimeoutException, NoSuchElementException):
        print("Loader does not exist or took too long to disappear.")

def slow_typing(text, element, delay=0.5):
    """Simulates human typing by typing one character at a time."""
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.1, delay))  # Mimic random typing speed

def load_existing_data():
    try:
        with open("result.json", "r") as json_file:
            existing_data = json.load(json_file)
            written_stock_numbers = {entry["stock_number"] for entry in existing_data}
            return existing_data, written_stock_numbers
    except (FileNotFoundError, json.JSONDecodeError):
        return [], set()

def append_to_json(data):
    try:
        with open("result.json", "r+") as json_file:
            try:
                existing_data = json.load(json_file)
            except json.JSONDecodeError:
                existing_data = []
            existing_data.append(data)
            json_file.seek(0)
            json.dump(existing_data, json_file, indent=4)
            json_file.truncate()
    except Exception as e:
        print(f"Error writing to result.json: {e}")

# Initialize the undetected Chrome driver
driver = Chrome(options=options, driver_executable_path="./chromedriver.exe")

try:
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
    # Navigate to Live Auctions Calendar page in the same tab
    print("Navigating to Live Auctions page...")
    driver.get("https://www.iaai.com/LiveAuctionsCalendar")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    
    existing_data, written_stock_numbers = load_existing_data()

    # Handle consent banner if present
    try:
        consent_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@id='truste-consent-content']//button[text()='Accept']"))
        )
        consent_button.click()
        print("Consent banner accepted.")
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element((By.ID, "truste-consent-content"))
        )
    except TimeoutException:
        print("No consent banner found. Proceeding.")

    try:
        # Locate the first "Bid Live" button
        print("Locating the first 'Bid Live' button...")
        first_bid_live_button = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, "//a[@class='btn btn-lg btn-primary btn-block' and .//span[text()='Bid Live']]"))
        )
        
        if first_bid_live_button:
            # Extract the href attribute
            href = first_bid_live_button.get_attribute("href")
            print(f"'Bid Live' button href: {href}")

            # Extract the AuctionScheduleId from the href
            auction_schedule_id = href.split("AuctionScheduleId=")[1].split("&")[0]
            print(f"Extracted AuctionScheduleId: {auction_schedule_id}")

            # Locate the parent div and count the number of <span> elements
            print("Counting spans for the 'Bid Live' button...")
            parent_div = first_bid_live_button.find_element(By.XPATH, "./ancestor::div[@class='table-cell table-cell--status']")
            spans_in_parent_div = parent_div.find_elements(By.XPATH, ".//span")
            span_count = len(spans_in_parent_div)
            print(f"Number of spans: {span_count}")

            # Construct the new link
            event_ids = ",".join([f"{auction_schedule_id}_{i}" for i in range(1, span_count + 1)])
            new_link = f"https://www.iaai.com/JoinSale?EventId={event_ids}&IsMobile=False&Tenant=US"
            print(f"Constructed link: {new_link}")

            # Navigate to the new link
            print("Navigating to the new link...")
            driver.get(new_link)
            print("Navigation complete.")
            
            # Wait for the page to load fully and the loader to disappear
            print("Waiting for the loader to disappear or not exist...")
            wait_for_loader_to_disappear(driver)
            print("Loader is gone or not present.")

            while True:
                try:
                    # Wait for the overlay and extract auction status
                    print("Waiting for auction status overlay...")
                    WebDriverWait(driver, 300).until(
                        EC.visibility_of_element_located((By.CSS_SELECTOR, "div#soldOthersOverLay.media-banner"))
                    )

                    print("Extracting auction status...")
                    h3_element = driver.find_element(By.ID, "soldOthersOverLayMsg")
                    auction_status = h3_element.text

                    # Wait for the stock-number element
                    print("Locating the 'stock-number' class...")
                    stock_number_element = WebDriverWait(driver, 20).until(
                        EC.presence_of_element_located((By.CLASS_NAME, "stock-number"))
                    )

                    # Locate the first <a> element inside the stock-number class
                    print("Locating the first <a> element inside 'stock-number'...")
                    stock_number_link = stock_number_element.find_element(By.TAG_NAME, "a")
                    stock_number_href = stock_number_link.get_attribute("href")
                    print(f"Extracted stock number href: {stock_number_href}")

                    # Assuming stock number is the last part of the href URL path
                    stock_number = stock_number_href.split("/")[-1]
                    print(f"Extracted stock number: {stock_number}")

                    # Skip writing if the stock number is already in the set
                    if stock_number in written_stock_numbers:
                        print(f"Duplicate stock number {stock_number} detected. Skipping...")
                        continue

                    # Prepare data with timestamp
                    timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
                    print(f"Timestamp: {timestamp}")

                    data = {
                        "timestamp": timestamp,
                        "stock_number_href": stock_number_href,
                        "stock_number": stock_number,
                        "Final_Bid": auction_status
                    }

                    # Append data to existing_data and write to file
                    append_to_json(data)

                    # Add stock number to the set to prevent future duplicates
                    written_stock_numbers.add(stock_number)

                    print("Data successfully appended to result.json:", data)

                except Exception as e:
                    print("Error during execution:", e)
                    driver.save_screenshot('error.png')
        else:
            print("No 'Bid Live' button found.")

    except Exception as e:
        print("Error during execution:", e)
        driver.save_screenshot('error.png')

finally:
    try:
        print("Closing browser...")
        driver.quit()
    except Exception as close_error:
        print("Error while closing the browser:", close_error)