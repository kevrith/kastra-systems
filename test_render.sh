#!/bin/bash

RENDER_API="https://kastra-systems.onrender.com/api"

echo "=== Testing Render Backend ==="
echo "Health check:"
curl -s https://kastra-systems.onrender.com/health | jq

echo -e "\n=== 1. Register Admin ==="
REGISTER_RESPONSE=$(curl -s -X POST "$RENDER_API/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@render.com","password":"admin123","first_name":"Test","last_name":"Admin","role":"admin"}')
echo "$REGISTER_RESPONSE" | jq

echo -e "\n=== 2. Login ==="
TOKEN=$(curl -s -X POST "$RENDER_API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@render.com","password":"admin123"}' | jq -r '.access_token')
echo "Token: ${TOKEN:0:30}..."

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed! Trying with existing admin..."
  TOKEN=$(curl -s -X POST "$RENDER_API/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@test.com","password":"admin123"}' | jq -r '.access_token')
  echo "Token: ${TOKEN:0:30}..."
fi

echo -e "\n=== 3. Create Teacher ==="
TEACHER_RESPONSE=$(curl -s -X POST "$RENDER_API/teachers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"renderteacher@test.com","first_name":"Render","last_name":"Teacher","password":"teacher123","phone":"1234567890","department":"Math"}')
echo "$TEACHER_RESPONSE" | jq
TEACHER_ID=$(echo "$TEACHER_RESPONSE" | jq -r '.id')

echo -e "\n=== 4. Create Student ==="
STUDENT_RESPONSE=$(curl -s -X POST "$RENDER_API/students" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"renderstudent@test.com","first_name":"Render","last_name":"Student","password":"student123","grade_level":11}')
echo "$STUDENT_RESPONSE" | jq
echo "Student ID: $(echo "$STUDENT_RESPONSE" | jq -r '.student_id')"

echo -e "\n=== 5. Create Course ==="
if [ ! -z "$TEACHER_ID" ] && [ "$TEACHER_ID" != "null" ]; then
  COURSE_RESPONSE=$(curl -s -X POST "$RENDER_API/courses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"name\":\"Math 101\",\"code\":\"MTH101\",\"description\":\"Basic Math\",\"credits\":3,\"teacher_id\":$TEACHER_ID}")
  echo "$COURSE_RESPONSE" | jq
else
  echo "No teacher ID available, skipping course creation"
fi
