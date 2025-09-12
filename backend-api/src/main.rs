use std::error::Error;
use serde_json::Value;

async fn fetch_axolotl_api() -> Result<(), Box<dyn Error>> {
    let client = reqwest::Client::new();

    let endpoints = [
        "https://theaxolotlapi.netlify.app"
    ];

    for endpoint in endpoints {
     println!("Trying endpoint: {}", endpoint);
     
     let response = client.get(endpoint)
     .header("Accept", "application/json")
     .send().await?;
     if response.status().is_success(){
        match response.json().await{
            Ok(json_data) => {
                println!("Successful response from: {}", endpoint);
                match serde_json::from_value::<Value>(json_data){
                    Ok(json) => {
                        println!("JSON response: {}", serde_json::to_string_pretty(&json)?);
                        return Ok(());
                    },
                    Err(_) => {
                        println!("Response is not JSON");
                    }
        }
    }
    Err(e)=> {println!("Error: {}", e);}
        }
    } else {
        println!("Request failed with status: {}", response.status());
    }
    println!("-------------------------------------------");
    }
    println!("Could not find a working API endpoint");
    Ok(())
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    fetch_axolotl_api().await?;
    Ok(())
}