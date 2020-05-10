
// alert("I will go to the client ");
const d = document;
const stripe = Stripe('pk_test_ZN4f6Z1tmqHyaKzHblk84y2K00unLLJgRr');
const paymentBtn = d.querySelector(".payment");
const loginForm = d.querySelector(".login");
const emailBox = d.querySelector(".email");
const passwordBox = d.querySelector(".password");
const logout = d.querySelector(".logout");
const updateProfile = d.querySelector(".updateProfile");
async function payementHelper(planId) {
  const response = await axios.post("/api/bookings/createSession", { planId });
  if (response.data.status) {
    const { session } = response.data;
    const id = session.id;
    stripe.redirectToCheckout({
      sessionId: id
    }).then(function (result) {
      alert(result.error.message);
    });

  } else {
    alert("Payment failed");
  }
}

async function updateProfileHelper(mutipartFormData) {
  const response = await axios.patch("api/users/ProfileImage", mutipartFormData);
  console.log(response.data);
  if (response.data.status === "image uploaded") {
    alert("Profile Image updated");
    location.reload();
  } else {
    alert("some error occurred");
  }

}
async function loginHelper(email, password) {
  const backendResponse = await axios.post("/api/users/login", { email, password });
  if (backendResponse.data.status === "userLogged In") {
    alert("user LoggedIn");
    //  frontent browser
    location.assign("/profile");
  } else {
    alert("Wrong Email or password");
  }
}
async function logoutHelper() {
  const backendResponse = await axios.get("/logout");
  if (backendResponse.data.status == "user LoggedOut") {
    // wrong token 
    location.reload();
  } else {
    alert("logout failed");
  }
}
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    // default behaviour 
    e.preventDefault();
    const email = emailBox.value;
    const password = passwordBox.value;
    loginHelper(email, password);
  })
}
if (logout) {
  logout.addEventListener("click", function () {
    logoutHelper();
  })
}
if (updateProfile) {
  updateProfile.addEventListener("change", function (e) {
    e.preventDefault();
    // capture image so that we could send to backend
    // console.log("change event occurred");

    const mutipartFormData = new FormData();
    mutipartFormData.append("photo", updateProfile.files[0]);
    updateProfileHelper(mutipartFormData);
  })
}



if (paymentBtn) {
  paymentBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const planId = paymentBtn.getAttribute("plan-id");
    payementHelper(planId);
  })
}