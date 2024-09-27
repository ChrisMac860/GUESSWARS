# Read from the STARWARSCHARACTERS.txt file and generate characters.js

def process_star_wars_characters(input_text):
    characters = []
    lines = input_text.strip().split("\n")
    
    for line in lines:
        # Split the line into key-value pairs
        key_value_pairs = line.split(", ")
        
        # Create a dictionary to hold character data
        character = {}
        for pair in key_value_pairs:
            # Ensure there is a proper key-value structure
            if ": " in pair:
                key, value = pair.split(": ", 1)
                if key == "Appeared in":
                    value = value.split(", ")  # Split the appeared in movies into a list
                character[key.lower().replace(" ", "")] = value
        
        # Rename keys to match required format
        if character:
            formatted_character = {
                "name": character.get("name"),
                "affiliation": character.get("affiliation"),
                "weapon": character.get("weapon"),
                "forceSensitive": character.get("forcesensitive"),
                "planet": character.get("planet"),
                "species": character.get("species"),
                "died": character.get("died"),
                "occupation": character.get("occupation"),
                "appearedIn": character.get("appearedin", [])
            }
            
            # Append the character dictionary to the list
            characters.append(formatted_character)
    
    return characters

def read_and_write_files(input_file, output_file):
    # Read the contents of the input text file
    with open(input_file, 'r') as f:
        input_text = f.read()
    
    # Process the characters from the input text
    characters = process_star_wars_characters(input_text)
    
    # Write the formatted characters to the output JavaScript file
    with open(output_file, 'w') as f:
        f.write("const characters = ")
        f.write(str(characters))
        f.write(";")
    
    print(f"Characters data has been written to {output_file}")

# Specify the input text file and output JS file
input_file = 'STARWARSCHARACTERS.txt'
output_file = 'characters.js'

# Run the function to process and write the files
read_and_write_files(input_file, output_file)
