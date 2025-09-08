import csv
import json

def get_country_name(country_code):
    """Convert country code to full country name"""
    country_map = {
        'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'FR': 'France',
        'DE': 'Germany', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands', 'AU': 'Australia',
        'JP': 'Japan', 'CN': 'China', 'KR': 'South Korea', 'IN': 'India', 'BR': 'Brazil',
        'MX': 'Mexico', 'RU': 'Russia', 'AE': 'United Arab Emirates', 'SG': 'Singapore',
        'TH': 'Thailand', 'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines',
        'VN': 'Vietnam', 'TR': 'Turkey', 'EG': 'Egypt', 'ZA': 'South Africa',
        'AR': 'Argentina', 'CL': 'Chile', 'PE': 'Peru', 'CO': 'Colombia', 'VE': 'Venezuela',
        'PF': 'French Polynesia', 'SO': 'Somalia', 'DZ': 'Algeria', 'AT': 'Austria',
        'CH': 'Switzerland', 'BE': 'Belgium', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
        'FI': 'Finland', 'IE': 'Ireland', 'PT': 'Portugal', 'GR': 'Greece', 'PL': 'Poland',
        'CZ': 'Czech Republic', 'HU': 'Hungary', 'RO': 'Romania', 'BG': 'Bulgaria',
        'HR': 'Croatia', 'SI': 'Slovenia', 'SK': 'Slovakia', 'LT': 'Lithuania', 'LV': 'Latvia',
        'EE': 'Estonia', 'IS': 'Iceland', 'MT': 'Malta', 'CY': 'Cyprus', 'LU': 'Luxembourg',
        'MC': 'Monaco', 'AD': 'Andorra', 'SM': 'San Marino', 'VA': 'Vatican City',
        'HK': 'Hong Kong', 'MO': 'Macau', 'TW': 'Taiwan', 'NZ': 'New Zealand'
    }
    return country_map.get(country_code, country_code)

def is_popular_airport(iata_code):
    """Check if airport is considered popular/major"""
    popular_codes = [
        'JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'LAS', 'SEA', 'MIA',
        'BOS', 'PHX', 'BWI', 'DCA', 'IAD', 'LGA', 'EWR', 'MSP', 'DTW', 'CLT',
        'LHR', 'CDG', 'FRA', 'AMS', 'FCO', 'BCN', 'VIE', 'ZUR', 'MUC', 'LGW',
        'ORY', 'MAD', 'LIS', 'ARN', 'CPH', 'OSL', 'HEL', 'DUB', 'BRU', 'GVA',
        'NRT', 'ICN', 'BKK', 'SIN', 'HKG', 'DXB', 'DOH', 'KUL', 'CGK', 'MNL',
        'YYZ', 'YVR', 'YUL', 'SYD', 'MEL', 'BNE', 'PER', 'AKL', 'GRU', 'EZE',
        'SCL', 'LIM', 'BOG', 'CCS', 'PTY', 'CUN', 'GDL', 'MTY', 'TIJ', 'MEX'
    ]
    return iata_code in popular_codes

def generate_airports_from_csv():
    """Read CSV and generate TypeScript airport array"""
    airports = []
    
    try:
        with open('apps/web/public/airports.csv', 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            header = next(csv_reader)  # Skip header
            
            print(f"CSV Header: {header}")
            
            for row_num, row in enumerate(csv_reader, start=2):
                if len(row) < 11:
                    continue
                    
                try:
                    iata_code = row[0].strip()
                    icao_code = row[1].strip()
                    airport_name = row[2].strip()
                    country_code = row[9].strip()
                    city_name = row[10].strip()
                    
                    # Skip if essential data is missing
                    if not iata_code or not airport_name:
                        continue
                        
                    # Use airport name as city if city is empty
                    if not city_name:
                        city_name = airport_name
                    
                    # Only include airports with valid IATA codes (2-4 characters)
                    if len(iata_code) < 2 or len(iata_code) > 4:
                        continue
                    
                    airport = {
                        'iata': iata_code,
                        'icao': icao_code,
                        'name': airport_name,
                        'cityName': city_name,
                        'countryName': get_country_name(country_code),
                        'popular': is_popular_airport(iata_code)
                    }
                    
                    airports.append(airport)
                    
                except Exception as e:
                    print(f"Error processing row {row_num}: {e}")
                    continue
    
    except FileNotFoundError:
        print("Error: airports.csv not found in apps/web/public/")
        return
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    print(f"Processed {len(airports)} airports")
    
    # Generate TypeScript code
    ts_code = "const getHardcodedAirports = (): SearchableAirport[] => {\n  return [\n"
    
    for airport in airports:
        ts_code += f"    {{ iata: '{airport['iata']}', icao: '{airport['icao']}', name: '{airport['name'].replace("'", "\\'")}', cityName: '{airport['cityName'].replace("'", "\\'")}', countryName: '{airport['countryName']}', popular: {str(airport['popular']).lower()} }},\n"
    
    ts_code += "  ];\n};"
    
    # Write to file
    with open('generated_airports.ts', 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"Generated TypeScript code saved to 'generated_airports.ts'")
    print(f"Total airports: {len(airports)}")
    print(f"Popular airports: {len([a for a in airports if a['popular']])}")

if __name__ == "__main__":
    generate_airports_from_csv()
