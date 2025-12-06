#!/bin/bash

echo "=== Testing Student Creation ==="
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"admin123"}' | jq -r '.access_token')
echo "Token: ${TOKEN:0:20}..."

echo -e "\nCreating student..."
curl -s -X POST http://localhost:8000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"newstudent@test.com","first_name":"New","last_name":"Student","password":"test123","grade_level":9}' | jq

echo -e "\n=== Testing Course Creation ==="
echo "Getting first teacher ID..."
TEACHER_ID=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/teachers | jq -r '.[0].id')
echo "Teacher ID: $TEACHER_ID"

echo -e "\nCreating course..."
curl -s -X POST http://localhost:8000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"Test Course\",\"code\":\"TST101\",\"description\":\"Test\",\"credits\":3,\"teacher_id\":$TEACHER_ID}" | jq
