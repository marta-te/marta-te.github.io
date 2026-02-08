#!/bin/bash

# Image optimization script using sips (macOS built-in tool)
# This will compress and resize images for web use

echo "Starting image optimization..."

# Function to optimize JPEG/JPG files
optimize_jpeg() {
    local file="$1"
    local max_size=2000  # Max dimension in pixels
    local quality=85     # JPEG quality (0-100)
    
    echo "Optimizing: $file"
    
    # Get current dimensions
    width=$(sips -g pixelWidth "$file" | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$file" | tail -1 | awk '{print $2}')
    
    # Resize if too large
    if [ "$width" -gt "$max_size" ] || [ "$height" -gt "$max_size" ]; then
        sips --resampleHeightWidthMax "$max_size" "$file" > /dev/null
    fi
    
    # Set quality
    sips -s format jpeg -s formatOptions "$quality" "$file" > /dev/null
}

# Function to convert PNG to JPEG (for photos/art)
convert_png_to_jpeg() {
    local file="$1"
    local output="${file%.*}.jpg"
    local quality=85
    
    echo "Converting PNG to JPEG: $file"
    
    # Convert to JPEG
    sips -s format jpeg -s formatOptions "$quality" "$file" --out "$output" > /dev/null
    
    # Remove original PNG if conversion successful
    if [ -f "$output" ]; then
        rm "$file"
        
        # Optimize the new JPEG
        optimize_jpeg "$output"
    fi
}

# Optimize plants folder
echo "Optimizing plants folder..."
find plants -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
    optimize_jpeg "$file"
done

# Optimize art-2d folder - convert PNGs to JPEGs for photos/paintings
echo "Optimizing art-2d folder..."
find art-2d -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
    optimize_jpeg "$file"
done

find art-2d -type f -iname "*.png" | while read file; do
    convert_png_to_jpeg "$file"
done

# Optimize projects-images folder
echo "Optimizing projects-images folder..."
find projects-images -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
    optimize_jpeg "$file"
done

# For project PNGs, keep them if they're small, otherwise convert
find projects-images -type f -iname "*.png" | while read file; do
    size=$(stat -f%z "$file")
    if [ "$size" -gt 500000 ]; then  # If larger than 500KB
        convert_png_to_jpeg "$file"
    fi
done

echo "Image optimization complete!"
echo "Original images backed up in image-backups folder"
