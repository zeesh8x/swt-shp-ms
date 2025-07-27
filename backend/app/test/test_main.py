import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import  Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    # Drop and create fresh tables for tests
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_register_user():
    response = client.post("/users/", json={"username": "testuser", "password": "strongpassword", "role": "user"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "role" in data and data["role"] == "user"

def test_register_duplicate_user():
    client.post("/users/", json={"username": "testuser", "password": "strongpassword", "role": "user"})
    response = client.post("/users/", json={"username": "testuser", "password": "anotherpass", "role": "user"})
    assert response.status_code == 400

def test_login_user():
    client.post("/users/", json={"username": "testuser", "password": "strongpassword", "role": "user"})
    response = client.post("/token", data={"username": "testuser", "password": "strongpassword"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
