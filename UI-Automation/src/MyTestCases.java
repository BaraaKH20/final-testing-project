import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.edge.EdgeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class MyTestCases {

	

	String myWebsite = "https://www.saucedemo.com/";
	
	WebDriver driver= new EdgeDriver();
	
	String userName = "standard_user";
	
	String password = "secret_sauce";
	
	Random rand = new Random();
	
	
	
	@BeforeTest
	public void SetUp() throws InterruptedException {
		
		driver.get(myWebsite);
		
		driver.manage().window().maximize();
		
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
	}
	
	@Test(priority = 1)
    public void login() throws InterruptedException {
		
		
		driver.findElement(By.id("user-name")).sendKeys(userName);
	     
		driver.findElement(By.id("password")).sendKeys(password);
	
		driver.findElement(By.id("login-button")).click();
	}
		
		
	@Test(priority = 2, enabled = true)
	public void AddItemToTheCart() {
		List<WebElement>addButtons = driver.findElements(By.cssSelector(".btn_inventory"));
		Random rand = new Random();
	    int randomIndex = rand.nextInt(addButtons.size());
	    
	    addButtons.get(randomIndex).click();
	}
	    
	    
	@Test(priority = 3)
	public void openCart() {
		driver.findElement(By.className("shopping_cart_link")).click();
		
	}
	
		
		
	@Test (priority = 4)
	public void checkOut () throws InterruptedException {
		
		driver.findElement(By.id("checkout")).click();
		
		Thread.sleep(3000);
		
		driver.findElement(By.id("first-name")).sendKeys("Baraa");
		driver.findElement(By.id("last-name")).sendKeys("Hussien");
        driver.findElement(By.id("postal-code")).sendKeys("12345");		
        
        Thread.sleep(3000);
        
        driver.findElement(By.id("continue")).click();
        
        driver.findElement(By.id("finish")).click();
        
        String thankYouMessage = driver.findElement(By.className("complete-header")).getText();
        
        Assert.assertEquals(thankYouMessage, "Thank you for your order!");
	}
	
	@Test (priority  = 5, enabled = false)
	public void wihtoutItems () {
		
		driver.findElement(By.className("shopping_cart_link")).click();

		driver.findElements(By.id("checkout"));
		
		List<WebElement>errorMsg = driver.findElements(By.id("error-message-container"));
		Assert.assertTrue(errorMsg.size() > 0, "CheckOut button should not be visible for empty cart");
		System.out.println("Error message disaplyed: " + errorMsg.get(0).getText());
		
		
		 driver.get("https://www.saucedemo.com/inventory.html");
	
		
	}
        
    @Test (priority = 6)
    public void openMenuButton () throws InterruptedException {
    	Thread.sleep(3000);
    	driver.findElement(By.id("react-burger-menu-btn")).click();
    }
    
    @Test (priority = 7)
    public void openAboutLink () {
    	
    	//driver.findElement(By.id("react-burger-menu-btn")).click();
        
    	WebElement aboutLink = driver.findElement(By.id("about_sidebar_link"));
    	
    	String openInNewTab = Keys.chord(Keys.COMMAND, Keys.RETURN);
        aboutLink.sendKeys(openInNewTab);
        
        ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());
        
        driver.switchTo().window(tabs.get(1));
        
        Assert.assertTrue(driver.getCurrentUrl().contains("saucelabs"));
        
        String mainTab = driver.getWindowHandle();
		driver.switchTo().window(mainTab);
        
        System.out.println("Back to main page");

    	
    }
    
    	
    @Test (priority = 8, enabled = true)
    public void resetApp () throws InterruptedException {
  	  	
  	ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());
  	driver.switchTo().window(tabs.get(0));
  	driver.navigate().refresh();
  	
	 Thread.sleep(300);
	 
  	driver.findElement(By.id("back-to-products")).click();
	AddItemToTheCart();

  	Thread.sleep(3000);
	
  	List<WebElement> menuBtnList = driver.findElements(By.id("react-burger-menu-btn"));
  	if(menuBtnList.size() > 0) {
  	menuBtnList.get(0).click();
  	
  	List<WebElement> resetBtn = driver.findElements(By.id("reset_sidebar_link"));
  	if(resetBtn.size() > 0) {
  		resetBtn.get(0).click();
  		
  	  }
  	}
  	
  	List<WebElement> cartBadge = driver.findElements(By.className("shopping_cart_badge"));
  	if(cartBadge.size() > 0) {
  	    Assert.assertEquals(cartBadge.get(0).getText(), "0");
  	} else {
  	    Assert.assertTrue(true); 
  	}
  }

    @Test (priority = 9, enabled = true)
    public void loggOutButton () throws InterruptedException {
    	
    	 Thread.sleep(300);
  	     driver.findElement(By.id("react-burger-menu-btn"));
  	   
    	 driver.findElement(By.id("logout_sidebar_link")).click();
    }
		
		
	
		
	
		
		

		
		
	
	
	
	
	
	
	
	
	@AfterTest
    public void AfterMyTest() {
		//driver.close();
	}
	
}
