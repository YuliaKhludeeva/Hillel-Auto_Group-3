from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time
options = Options()
options.add_argument("--no-sandbox")
driver = webdriver.Chrome(service=Service('/Users/uliapoddubnaa/Downloads/chromedriver'), options=options)
user = "guest"
password = "welcome2qauto"
driver.get("https://"+user+":"+password+"@"+"qauto2.forstudy.space/")
WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Sign In')]"))).click()
elements = driver.find_elements(By.XPATH, "//label[contains(text(), 'Email')]")
elements = driver.find_elements(By.XPATH, "//label[contains(text(), 'Password')]")
elements = driver.find_elements(By.XPATH, "//label[contains(text(), 'Remember me')]")
elements = driver.find_elements(By.XPATH, "//button[contains(text(), 'Forgot password')]")
elements = driver.find_elements(By.XPATH, "//button[contains(text(), 'Registration')]")
elements = driver.find_elements(By.XPATH, "//button[contains(text(), 'Login')]")
print(len(elements))
assert len(elements) > 0
Password = 111111111111111111111111
time.sleep(1)
assert "Email required" not in driver.page_source
driver.close()