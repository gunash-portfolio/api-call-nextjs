
use std::error::Error;
use scraper::{Html, Selector};

async fn extract_data_from_html() -> Result<(), Box<dyn Error>> {
    let response = reqwest::get("https://theaxolotlapi.netlify.app").await?;
    let body = response.text().await?;
    let document = Html::parse_document(&body);
    
    // Extract the title
    if let Some(title) = extract_text_by_selector(&document, "title") {
        println!("Page Title: {}", title.trim());
    }
    
    // Extract main heading (h1)
    if let Some(h1) = extract_text_by_selector(&document, "h1") {
        println!("\nMain Heading: {}", h1.trim());
    }
    
    // Extract all section headings (h2)
    println!("\nSection Headings:");
    let h2_selector = Selector::parse("h2").unwrap();
    for (i, element) in document.select(&h2_selector).enumerate() {
        let text = element.text().collect::<Vec<_>>().join("");
        println!("  {}. {}", i+1, text.trim());
    }
    
    // Extract all subsection headings (h3)
    println!("\nSubsection Headings:");
    let h3_selector = Selector::parse("h3").unwrap();
    for (i, element) in document.select(&h3_selector).enumerate() {
        let text = element.text().collect::<Vec<_>>().join("");
        println!("  {}. {}", i+1, text.trim());
    }
    
    // Extract all links
    println!("\nLinks:");
    let link_selector = Selector::parse("a").unwrap();
    for (i, element) in document.select(&link_selector).enumerate() {
        let text = element.text().collect::<Vec<_>>().join("");
        let href = element.value().attr("href").unwrap_or("No URL");
        println!("  {}. {} -> {}", i+1, text.trim().if_empty_default("[No text]"), href);
    }
    
    // Extract API specifications
    println!("\nAPI Specifications:");
    if let Some(api_section) = find_element_containing_text(&document, "h2", "API Specification") {
        // Find the next paragraphs after the API section
        let items = find_elements_after(&document, &api_section, "p");
        for item in items {
            let text = item.text().collect::<Vec<_>>().join("");
            if !text.trim().is_empty() {
                println!("  - {}", text.trim());
            }
        }
    }
    
    // Extract specific information about Axolotl food
    println!("\nAxolotl Food Information:");
    if let Some(food_section) = find_element_containing_text(&document, "h3", "Food") {
        // Find paragraphs after the Food heading
        let paragraphs = find_elements_after(&document, &food_section, "p");
        for p in paragraphs {
            let text = p.text().collect::<Vec<_>>().join("");
            if !text.trim().is_empty() {
                println!("  - {}", text.trim());
            }
        }
    }
    
    Ok(())
}

// Helper function to extract text by selector
fn extract_text_by_selector(document: &Html, selector_str: &str) -> Option<String> {
    let selector = Selector::parse(selector_str).ok()?;
    let element = document.select(&selector).next()?;
    Some(element.text().collect::<Vec<_>>().join(""))
}

// Helper function to find an element containing specific text
fn find_element_containing_text<'a>(document: &'a Html, selector_str: &str, text: &str) -> Option<scraper::ElementRef<'a>> {
    let selector = Selector::parse(selector_str).ok()?;
    document.select(&selector).find(|el| {
        el.text().collect::<String>().contains(text)
    })
}

// Helper function to find elements after a given element
fn find_elements_after<'a>(document: &'a Html, start_element: &scraper::ElementRef<'a>, selector_str: &str) -> Vec<scraper::ElementRef<'a>> {
    let selector = match Selector::parse(selector_str) {
        Ok(s) => s,
        Err(_) => return vec![],
    };
    
    let mut collecting = false;
    let mut results = vec![];
    
    for element in document.select(&Selector::parse("*").unwrap()) {
        // If we found our starting element, start collecting
        if element.id() == start_element.id() {
            collecting = true;
            continue; // Skip the start element itself
        }
        
        // If we're collecting and found another heading, stop collecting
        if collecting && element.value().name().starts_with('h') {
            break;
        }
        
        // If we're collecting and the element matches our selector, add it
        if collecting && selector_str == element.value().name() {
            results.push(element);
        }
    }
    
    results
}

// Extension trait for string trimming with default for empty strings
trait StringUtils {
    fn if_empty_default<'a>(&'a self, default: &'a str) -> &'a str;
}

impl StringUtils for str {
    fn if_empty_default<'a>(&'a self, default: &'a str) -> &'a str {
        if self.trim().is_empty() { default } else { self }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    extract_data_from_html().await?;
    Ok(())
}
