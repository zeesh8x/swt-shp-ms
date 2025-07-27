import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def admin_token():
    client.post("/users/", json={"username": "admin", "password": "adminpass", "role": "admin"})
    response = client.post("/token", data={"username": "admin", "password": "adminpass"})
    return response.json()["access_token"]

@pytest.fixture
def user_token():
    client.post("/users/", json={"username": "user", "password": "userpass", "role": "user"})
    response = client.post("/token", data={"username": "user", "password": "userpass"})
    return response.json()["access_token"]

def test_admin_can_add_and_list_sweets(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.post("/sweets/", json={
        "name": "Ladoo", "category": "Indian", "price": 80.0, "quantity": 12
    }, headers=headers)
    assert response.status_code == 200
    sweet_id = response.json()["id"]

    # Check listing
    list_resp = client.get("/sweets/", headers=headers)
    assert list_resp.status_code == 200
    assert any(s["id"] == sweet_id for s in list_resp.json())

def test_any_user_can_view_and_purchase(user_token, admin_token):
    # Seed a sweet as admin
    client.post("/sweets/", json={
        "name": "Barfi", "category": "Indian", "price": 50.0, "quantity": 5
    }, headers={"Authorization": f"Bearer {admin_token}"})

    # User purchases 3
    sweets = client.get("/sweets/", headers={"Authorization": f"Bearer {user_token}"}).json()
    sweet = sweets[0]
    purchase = client.post(f"/purchase/{sweet['id']}", json={"quantity": 3}, headers={"Authorization": f"Bearer {user_token}"})
    assert purchase.status_code == 200
    assert purchase.json()["quantity"] == 2

    # Fail purchase: too many
    too_many = client.post(f"/purchase/{sweet['id']}", json={"quantity": 10}, headers={"Authorization": f"Bearer {user_token}"})
    assert too_many.status_code == 400

def test_only_admin_can_edit_and_delete_sweets(admin_token, user_token):
    # Create sweet
    resp = client.post("/sweets/", json={
        "name": "Jalebi", "category": "Indian", "price": 100.0, "quantity": 4
    }, headers={"Authorization": f"Bearer {admin_token}"})
    sweet_id = resp.json()["id"]

    # Normal user tries edit - forbidden
    r = client.put(f"/sweets/{sweet_id}", json={
        "name": "Jalebi Edit", "category": "Indian", "price": 90.0, "quantity": 5
    }, headers={"Authorization": f"Bearer {user_token}"})
    assert r.status_code == 403

    # Admin can edit
    r = client.put(f"/sweets/{sweet_id}", json={
        "name": "Jalebi Edit", "category": "Indian", "price": 90.0, "quantity": 5
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200

    # Normal user tries delete - forbidden
    r = client.delete(f"/sweets/{sweet_id}", headers={"Authorization": f"Bearer {user_token}"})
    assert r.status_code == 403

    # Admin deletes
    r = client.delete(f"/sweets/{sweet_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200

def test_unauthenticated_requests_are_blocked():
    # Should be 401 Unauthorized for protected actions
    resp = client.get("/sweets/")
    assert resp.status_code == 401
    resp = client.post("/sweets/", json={"name": "Barfi", "category": "Indian", "price": 50, "quantity": 2})
    assert resp.status_code == 401
