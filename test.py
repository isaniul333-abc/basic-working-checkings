from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

driver.implicitly_wait(10)

driver.get(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
)

# Wait for page load
time.sleep(5)

# Enter Username
driver.find_element(
    By.NAME,
    "username"
).send_keys("Admin")

# Enter Password
driver.find_element(
    By.NAME,
    "password"
).send_keys("admin123")

# Click Login
driver.find_element(
    By.TAG_NAME,
    "button"
).click()

time.sleep(5)

# Verify Login Success
assert "dashboard" in driver.current_url.lower()

print("Login Successful!")

driver.quit()