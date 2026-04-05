const API = "http://localhost:3000";

function getHeaders() {
  return {
    Authorization: "Bearer " + localStorage.getItem("token")
  };
}