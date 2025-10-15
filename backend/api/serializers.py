'''
Serializers trong django REST framework dùng để chuyển đổi dữ liệu giữa:
Python object/Model Django -> JSON (hoặc dữ liệu API)

-> Serializers là cầu nối giữa back-end và front-end

Model → JSON để trả dữ liệu cho frontend
JSON → Model để nhận dữ liệu frontend gửi lên
'''

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only":True}}