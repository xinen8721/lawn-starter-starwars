#!/bin/bash

# API Testing Script for SWStarter
# This script tests all API endpoints

API_URL="http://localhost:8000/api"

echo "🧪 Testing SWStarter API"
echo "========================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Search for people
echo -e "${YELLOW}Test 1: Search for people (Luke)${NC}"
RESPONSE=$(curl -s -X POST ${API_URL}/search \
  -H "Content-Type: application/json" \
  -d '{"type":"people","term":"luke"}')

if echo "$RESPONSE" | grep -q "Luke Skywalker"; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 2: Search for movies
echo -e "${YELLOW}Test 2: Search for movies (Empire)${NC}"
RESPONSE=$(curl -s -X POST ${API_URL}/search \
  -H "Content-Type: application/json" \
  -d '{"type":"movies","term":"empire"}')

if echo "$RESPONSE" | grep -q "Empire"; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 3: Get person details
echo -e "${YELLOW}Test 3: Get person details (Luke Skywalker - ID 1)${NC}"
RESPONSE=$(curl -s ${API_URL}/people/1)

if echo "$RESPONSE" | grep -q "Luke Skywalker"; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 4: Get movie details
echo -e "${YELLOW}Test 4: Get movie details (A New Hope - ID 1)${NC}"
RESPONSE=$(curl -s ${API_URL}/movies/1)

if echo "$RESPONSE" | grep -q "A New Hope"; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 5: Get statistics
echo -e "${YELLOW}Test 5: Get statistics${NC}"
RESPONSE=$(curl -s ${API_URL}/statistics)

if echo "$RESPONSE" | grep -q "total_searches"; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 6: Validation error
echo -e "${YELLOW}Test 6: Validation error (invalid type)${NC}"
RESPONSE=$(curl -s -X POST ${API_URL}/search \
  -H "Content-Type: application/json" \
  -d '{"type":"invalid","term":"test"}')

if echo "$RESPONSE" | grep -q "Validation failed"; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 7: Search with no results
echo -e "${YELLOW}Test 7: Search with no results${NC}"
RESPONSE=$(curl -s -X POST ${API_URL}/search \
  -H "Content-Type: application/json" \
  -d '{"type":"people","term":"xyznonexistent"}')

if echo "$RESPONSE" | grep -q '"count":0'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

echo "========================"
echo "🏁 Testing complete!"
echo ""
echo "View detailed responses:"
echo "  curl -s ${API_URL}/statistics | jq"

