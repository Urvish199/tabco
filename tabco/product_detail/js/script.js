// Full implementation of JS (complete with mobile verification + error spacing fix)
const urlParams = new URLSearchParams(window.location.search);
const productId = "6b37c3874bbe42e89bc5d";
let salesManId;


if (!productId) {
  document.getElementById("loader").innerHTML = "<p>Product ID not found in URL.</p>";
} else {
  fetchProductDetails(productId);
}

function fetchProductDetails(id) {
  const params = new URLSearchParams();
  params.append("Id", id);

  fetch("https://etmsapi.tabcotechsoftware.com/api/QRPortal/GetQualByQrId", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  })
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      if (data.success) {
        injectVendorDetails(data);
        injectProductList(data.products);
      } else {
        throw new Error(data.message || "Failed to load product data.");
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      document.getElementById("loader").innerHTML = `<p>${error.message}</p>`;
    });
}

function injectVendorDetails(data) {
  const header = document.getElementById("header");
  // header.innerHTML = `
  //   <img src="${data.logoUrl}" alt="${data.appName}" class="site-logo" />
  //   <span class="site-title">${data.appName}</span>
  // `;

  

  const name = data.salesmanName?.trim() || "";
  const mobile = data.salesmanMobileNo?.trim() || "";
  const subtitle = (name || mobile) ? `${name.toUpperCase()}${name && mobile ? ' | ' : ''}${mobile}` : "";

  header.innerHTML = `
    <img src="${data.logoUrl}" alt="${data.appName}" class="site-logo" />
    <div class="site-text">
      <span class="site-title">${data.appName}</span>
      ${subtitle ? `<span class="site-subtitle">${subtitle}</span>` : ""}
    </div>
  `;


  salesManId = data.salesmanId;

  //  //  Create and append the "Add Item" button
  //  const addItemBtn = document.createElement("button");
  //  addItemBtn.id = "add-item-btn";
  //  addItemBtn.className = "add-item-btn";
  //  addItemBtn.textContent = "Add Item";
  //  header.appendChild(addItemBtn);

  const footer = document.getElementById("footer");
  footer.innerHTML = `<p>${data.copyRightText}</p>`;
}

function injectProductList(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const layout = document.createElement("div");
    layout.className = "product-layout";

    // 🖼️ Image Slider
    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "product-slider";

    const swiperContainer = document.createElement("div");
    swiperContainer.className = "swiper";

    const swiperWrapper = document.createElement("div");
    swiperWrapper.className = "swiper-wrapper";

    product.images.forEach(imgUrl => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const anchor = document.createElement("a");
      anchor.href = imgUrl;

      const img = document.createElement("img");
      img.src = imgUrl;

      anchor.appendChild(img);
      slide.appendChild(anchor);
      swiperWrapper.appendChild(slide);
    });

    swiperContainer.appendChild(swiperWrapper);
    swiperContainer.innerHTML += `<div class="swiper-pagination"></div>`;
    sliderWrapper.appendChild(swiperContainer);

    // 📄 Product Details
    const details = document.createElement("div");
    details.className = "product-details";

    // ✅ Title + Delete Button Row
    const titleRow = document.createElement("div");
    titleRow.className = "product-title-row";

    const title = document.createElement("h1");
    title.textContent = product.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-button";
    deleteBtn.textContent = "Delete";
    deleteBtn.title = "Remove this item";
    deleteBtn.addEventListener("click", () => {
      const card = deleteBtn.closest(".product-card");
      if (card) {
        showDeleteConfirmDialog(() => {
          card.remove();
          updateTotals();
        });
      }
    });

    titleRow.appendChild(title);
    titleRow.appendChild(deleteBtn);
    details.appendChild(titleRow);

    const description = document.createElement("p");
    description.innerHTML = product.description.replace(/\\n/g, "<br>");
    details.appendChild(description);

    const price = parseFloat(product.price) || 0;
    const priceTag = document.createElement("p");
    priceTag.className = "price";
    priceTag.textContent = `₹${price}`;

    const pcsText = document.createElement("span");
    pcsText.style.fontSize = "16px";
    pcsText.style.color = "#4CAF50";
    pcsText.style.marginLeft = "10px";
    pcsText.textContent = `[ ${product.qPcs || 1} Matching Pcs ]`;

    priceTag.appendChild(pcsText);
    details.appendChild(priceTag);

    // 🧾 Inputs Row 1: Pcs + Set
    const row1 = document.createElement("div");
    row1.style.display = "flex";
    row1.style.gap = "10px";
    row1.style.flexWrap = "wrap";

    // Pcs
    const qPcsWrapper = document.createElement("div");
    qPcsWrapper.className = "form-field";
    qPcsWrapper.style.visibility = "hidden";
    //qPcsWrapper.style.flex = "1";
    const qPcsLabel = document.createElement("label");
    qPcsLabel.textContent = "Matching";
    const qPcsInput = document.createElement("input");
    // qPcsInput.type = "number";
    qPcsInput.readOnly = true;
    qPcsInput.disabled = true;
    qPcsInput.style.border = "none";
    qPcsInput.style.background = "transparent";
    qPcsInput.style.pointerEvents = "none";
    qPcsInput.style.paddingLeft = "0";
    qPcsInput.className = "modern-input";
    qPcsInput.value = product.qPcs || 1;
    qPcsWrapper.appendChild(qPcsLabel);
    qPcsWrapper.appendChild(qPcsInput);

    // Set
    const setWrapper = document.createElement("div");
    setWrapper.className = "form-field";
    setWrapper.style.flex = "1";
    const setLabel = document.createElement("label");
    setLabel.textContent = "Set";
    const setInput = document.createElement("input");
    setInput.type = "number";
    setInput.placeholder = "0";
    setInput.min = "0";
    setInput.className = "modern-input";
    setWrapper.appendChild(setLabel);
    setWrapper.appendChild(setInput);

    // 🧾 Inputs Row 2: Quantity + Amount
    // const row2 = document.createElement("div");
    // row2.style.display = "flex";
    // row2.style.gap = "20px";
    // row2.style.flexWrap = "wrap";
    // row2.style.marginTop = "10px";

    // Quantity
    const qtyWrapper = document.createElement("div");
    qtyWrapper.className = "form-field";
    qtyWrapper.style.flex = "1";
    const qtyLabel = document.createElement("label");
    qtyLabel.textContent = "Quantity";
    const qtyInput = document.createElement("input");
    // qtyInput.type = "number";
    qtyInput.readOnly = true;
    qtyInput.disabled = true;
    qtyInput.style.border = "none";
    qtyInput.style.background = "transparent";
    qtyInput.style.pointerEvents = "none";
    qtyInput.style.paddingLeft = "0";
    qtyInput.className = "modern-input qty-input";
    qtyInput.value = "0";
    qtyWrapper.appendChild(qtyLabel);
    qtyWrapper.appendChild(qtyInput);

    // Amount
    const totalWrapper = document.createElement("div");
    totalWrapper.className = "form-field";
    totalWrapper.style.flex = "1";
    const totalLabel = document.createElement("label");
    totalLabel.textContent = "Amount";
    const totalInput = document.createElement("input");
    totalInput.type = "text";
    totalInput.readOnly = true;
    totalInput.disabled = true;
    totalInput.style.border = "none";
    totalInput.style.background = "transparent";
    totalInput.style.pointerEvents = "none";
    totalInput.style.paddingLeft = "0";
    totalInput.className = "modern-input-note";
    totalInput.value = "0.00";
    totalWrapper.appendChild(totalLabel);
    totalWrapper.appendChild(totalInput);

    // Add input event on set change
    setInput.addEventListener("input", () => {
      const pcs = parseFloat(qPcsInput.value) || 0;
      const set = parseFloat(setInput.value) || 0;
      const qty = pcs * set;
      qtyInput.value = qty;
      totalInput.value = (qty * price).toFixed(2);
      updateTotals();
    });

    // Assign data-* to qtyInput for global access
    [qPcsInput, setInput, qtyInput].forEach(input => {
      input.dataset.productId = product.id;
      input.dataset.price = product.price;
      input.dataset.name = product.name;
      input.dataset.catelog = product.catelog;
      input.dataset.image = product.images?.[0] || "resources/placeholder.png";
    });
    setInput.dataset.qPcs = product.qPcs || 1;

    //row1.appendChild(qPcsWrapper);
    row1.appendChild(setWrapper);
    row1.appendChild(qtyWrapper);
    row1.appendChild(totalWrapper);
    details.appendChild(row1);
    //details.appendChild(row1);

    // 🗒️ Additional Notes
    const noteWrapper = document.createElement("div");
    noteWrapper.className = "form-field";
    noteWrapper.style.marginTop = "16px";
    noteWrapper.style.width = "100%";
    const noteLabel = document.createElement("label");
    noteLabel.textContent = "Additional Notes";
    const noteInput = document.createElement("textarea");
    noteInput.placeholder = "Enter any remarks or notes...";
    noteInput.rows = 2;
    noteInput.className = "modern-input-note note-input";
    noteInput.dataset.productId = product.id;
    noteWrapper.appendChild(noteLabel);
    noteWrapper.appendChild(noteInput);
    details.appendChild(noteWrapper);

    layout.appendChild(sliderWrapper);
    layout.appendChild(details);
    productCard.appendChild(layout);
    container.appendChild(productCard);

    // LightGallery & Swiper
    lightGallery(swiperWrapper, {
      selector: "a",
      plugins: [lgZoom, lgFullscreen],
      speed: 500
    });

    new Swiper(swiperContainer, {
      loop: true,
      pagination: {
        el: swiperContainer.querySelector(".swiper-pagination"),
        clickable: true
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      }
    });
  });

  document.getElementById("loader").style.display = "none";
  document.getElementById("main-content").classList.remove("hidden");
}


function updateTotals() {
  const qtyInputs = document.querySelectorAll('.qty-input');
  let totalQty = 0;
  let totalAmt = 0;

  qtyInputs.forEach(qtyInput => {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(qtyInput.dataset.price) || 0;
    totalQty += qty;
    totalAmt += qty * price;
  });

  document.getElementById("total-qty").textContent = totalQty;
  document.getElementById("total-amt").textContent = totalAmt.toFixed(2);
}

// Place order button logic and dialog included in next file if needed due to size
document.getElementById("place-order-btn").addEventListener("click", () => {
  const orderList = [];
  document.querySelectorAll('.qty-input').forEach(qtyInput => {
    const quantity = parseFloat(qtyInput.value) || 0;
    if (!quantity || quantity <= 0) return;

    const price = parseFloat(qtyInput.dataset.price) || 0;
    const productId = qtyInput.dataset.productId;

    
    // ✅ Extract additional fields
    const setInput = document.querySelector(`input[data-product-id="${productId}"]:not([readonly])`);
    const qPcs = parseFloat(setInput?.dataset.qPcs || "1");
    const set = parseFloat(document.querySelector(`input[data-product-id="${productId}"]:not([readonly])`)?.value || 0);

    const rateInput = document.querySelector(`.rate-input[data-product-id="${productId}"]`);
    const noteInput = document.querySelector(`.note-input[data-product-id="${productId}"]`);

    const bidPrice = parseFloat(rateInput?.value || "0");
    const note = noteInput?.value || "";

    orderList.push({
      id: parseInt(productId),
      quantity,
      price,
      name: qtyInput.dataset.name,
      catelog: qtyInput.dataset.catelog,
      bidPrice,
      note,
      qPcs,
      set,
      amount: quantity * price
    });
  });

  if (orderList.length === 0) {
    alert("Please enter quantity for at least one product.");
    return;
  }

  showMobileDialog(orderList);
});


function showMobileDialog(orderList) {
  console.log("📦 Incoming orderList:", orderList);
  let otpFromServer = "";
  let mobileNumber = "";

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 1000;

  const dialog = document.createElement("div");
  dialog.style.width = "90%";
  dialog.style.maxWidth = "420px";
  dialog.style.background = "#fff";
  dialog.style.padding = "30px";
  dialog.style.borderRadius = "12px";
  dialog.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  dialog.style.display = "flex";
  dialog.style.flexDirection = "column";
  dialog.style.gap = "16px";
  dialog.style.position = "relative";
  dialog.style.animation = "fadeIn 0.3s ease";

  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "16px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.cursor = "pointer";
  closeBtn.addEventListener("click", () => document.body.removeChild(overlay));

  const title = document.createElement("h2");
  title.textContent = "Confirm Order";
  title.style.margin = 0;
  title.style.fontSize = "24px";
  title.style.color = "#333";

  const desc = document.createElement("p");
  desc.textContent = "Please enter your mobile number to receive an OTP.";
  desc.style.fontSize = "15px";
  desc.style.color = "#555";

  const input = document.createElement("input");
  input.type = "tel";
  input.placeholder = "Enter mobile number";
  input.maxLength = 10;
  input.className = "modern-input-note";
  input.style.width = "100%";

  const errorMsg = document.createElement("div");
  errorMsg.className = "error-message";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send OTP";
  sendBtn.style.padding = "12px";
  sendBtn.style.background = "#4CAF50";
  sendBtn.style.color = "white";
  sendBtn.style.border = "none";
  sendBtn.style.borderRadius = "8px";
  sendBtn.style.fontSize = "16px";
  sendBtn.style.cursor = "pointer";

  dialog.appendChild(closeBtn);
  dialog.appendChild(title);
  dialog.appendChild(desc);
  dialog.appendChild(input);
  dialog.appendChild(errorMsg);
  dialog.appendChild(sendBtn);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  function sendOtp(callback) {
    fetch("https://etmsapi.tabcotechsoftware.com/api/QRPortal/SendOtpToMobile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile: mobileNumber, productId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          otpFromServer = data.value.toString();
          callback && callback(data.value1 || {});
        } else {
          throw new Error(data.resultMessage);
        }
      })
      .catch(err => {
        errorMsg.textContent = "OTP Error: " + err.message;
        errorMsg.style.display = "block";
      });
  }

  sendBtn.onclick = () => {
    const mobile = input.value.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      errorMsg.textContent = "Please enter a valid 10-digit mobile number.";
      errorMsg.style.display = "block";
      return;
    }

    mobileNumber = mobile;
    errorMsg.style.display = "none";
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    sendOtp((prefill) => {
      const safePrefill = {
        orgName: prefill?.orgName || "",
        gstNo: prefill?.gstNo || "",
        contactPerson: prefill?.contactPerson || ""
      };
      sendBtn.disabled = false;
      sendBtn.textContent = "Verify OTP";
      renderOtpStep(safePrefill);
    });
  };

  function renderOtpStep(prefillData) {
    title.textContent = "Enter OTP";
    desc.textContent = `OTP sent to +91-${mobileNumber}`;
    input.type = "text";
    input.placeholder = "Enter 6-digit OTP";
    input.maxLength = 6;
    input.value = "";
    sendBtn.textContent = "Verify OTP";

    const resendSection = document.createElement("div");
    resendSection.className = "resend-section";
    resendSection.style.display = "flex";
    resendSection.style.justifyContent = "space-between";
    resendSection.style.alignItems = "center";

    const resendBtn = document.createElement("button");
    resendBtn.textContent = "Resend";
    resendBtn.disabled = true;
    resendBtn.style.background = "none";
    resendBtn.style.border = "none";
    resendBtn.style.color = "#4CAF50";
    resendBtn.style.cursor = "pointer";
    resendBtn.style.fontSize = "14px";

    const countdown = document.createElement("span");
    countdown.style.fontSize = "14px";
    countdown.style.color = "#555";

    resendSection.appendChild(resendBtn);
    resendSection.appendChild(countdown);
    dialog.appendChild(resendSection);

    let seconds = 60;
    resendBtn.style.color = "#aaa";
    let timer = setInterval(() => {
      seconds--;
      countdown.textContent = `Resend in ${seconds}s`;
      if (seconds <= 0) {
        clearInterval(timer);
        countdown.textContent = "";
        resendBtn.disabled = false;
        resendBtn.style.color = "#4CAF50";
      }
    }, 1000);

    resendBtn.addEventListener("click", () => {
      resendBtn.disabled = true;
      seconds = 60;
      countdown.textContent = `Resend in ${seconds}s`;
      timer = setInterval(() => {
        seconds--;
        countdown.textContent = `Resend in ${seconds}s`;
        if (seconds <= 0) {
        clearInterval(timer);
        countdown.textContent = "";
        resendBtn.disabled = false;
        resendBtn.style.color = "#4CAF50";
        }
      }, 1000);

      sendOtp();
    });

    sendBtn.onclick = () => {
      const otp = input.value.trim();
      if (otp !== otpFromServer) {
        errorMsg.textContent = "Invalid OTP. Please try again.";
        errorMsg.style.display = "block";
        return;
      }

      errorMsg.style.display = "none";
      renderFinalStep(prefillData);
    };
  }

  function renderFinalStep(prefill) {
    title.textContent = "Finalize Order";
    desc.textContent = "Please enter your details to complete the order.";
  
    input.remove();
    sendBtn.remove();
    errorMsg.remove();
    const resendSec = dialog.querySelector(".resend-section");
    if (resendSec) resendSec.remove();
  
    function createField(labelText, placeholder, value = "", readonly = false) {
      const label = document.createElement("label");
      label.textContent = labelText;
  
      const input = document.createElement("input");
      input.type = "text";
      input.className = "modern-input-note";
      input.placeholder = placeholder;
      input.value = value;
      if (readonly) input.readOnly = true;
  
      const error = document.createElement("div");
      error.className = "error-message";
  
      dialog.appendChild(label);
      dialog.appendChild(input);
      dialog.appendChild(error);
  
      return { input, error };
    }
  
    const org = createField("Organization Name", "Enter organization name", prefill.orgName || "", !!prefill.orgName);
    const gst = createField("GST Number", "Enter GST Number", prefill.gstNo || "", !!prefill.gstNo);
    const name = createField("Your Name", "Enter your name", prefill.contactPerson || "", !!prefill.contactPerson);
  
    // 📎 Attach File Section
    const fileWrapper = document.createElement("div");
    fileWrapper.className = "form-field";
    fileWrapper.style.marginTop = "16px";
  
    const fileHeading = document.createElement("label");
    fileHeading.textContent = "Attach File (optional)";
    fileHeading.style.marginBottom = "6px";
    fileHeading.style.display = "block";
  
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,application/pdf";
    fileInput.id = "file-upload";
    fileInput.style.display = "none";
  
    const fileLabel = document.createElement("label");
    fileLabel.textContent = "Choose File";
    fileLabel.setAttribute("for", "file-upload");
    fileLabel.className = "custom-file-button full-width";
  
    const fileNameDisplay = document.createElement("div");
    fileNameDisplay.className = "file-name-display";
  
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      fileNameDisplay.textContent = file ? file.name : "";
    });
  
    fileWrapper.appendChild(fileHeading);
    fileWrapper.appendChild(fileInput);
    fileWrapper.appendChild(fileLabel);
    fileWrapper.appendChild(fileNameDisplay);
    dialog.appendChild(fileWrapper);
  
    // ✅ Final Submit Button
    const finalBtn = document.createElement("button");
    finalBtn.textContent = "Place Order";
    Object.assign(finalBtn.style, {
      padding: "12px",
      background: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      width: "100%",
      marginTop: "20px"
    });
  
    finalBtn.addEventListener("click", async () => {
      let isValid = true;
  
      if (org.input.value.trim().length < 2) {
        org.error.textContent = "Please enter a valid organization name";
        org.error.style.display = "block";
        isValid = false;
      } else org.error.style.display = "none";
  
      const gstVal = gst.input.value.trim();
      if (gstVal.length > 0 && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(gstVal)) {
        gst.error.textContent = "Please enter a valid GST number";
        gst.error.style.display = "block";
        isValid = false;
      } else gst.error.style.display = "none";
  
      if (name.input.value.trim().length < 2) {
        name.error.textContent = "Please enter a valid name";
        name.error.style.display = "block";
        isValid = false;
      } else name.error.style.display = "none";
  
      if (!isValid) return;
  
      const payload = {
        orgDetail: {
          mobileNo: mobileNumber,
          productId: productId,
          orgName: org.input.value.trim(),
          gstNo: gst.input.value.trim(),
          contactPerson: name.input.value.trim(),
          salesmanId: salesManId
        },
        itemDetails: orderList.map(item => ({
          id: item.id,
          name: item.name || "",
          price: item.price,
          qty: item.quantity,
          qPcs: item.qPcs || 0,
          set: item.set || 0,
          amount: parseFloat((item.quantity * item.price).toFixed(2)), // as string for precision
          catelog: item.catelog || "",
          bidPrice: item.bidPrice || 0,
          note: item.note || ""
        }))
      };

      console.log(payload)
      
  
      finalBtn.disabled = true;
      finalBtn.textContent = "Placing Order...";
      finalBtn.style.opacity = "0.6";
      finalBtn.style.cursor = "not-allowed";
  
      const formData = new FormData();
      formData.append("orderDetail", JSON.stringify(payload));
  
      const selectedFile = fileInput.files?.[0];
  
      if (selectedFile) {
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
  
            img.onload = function () {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
  
              canvas.toBlob(blob => {
                formData.append("file", blob, "converted.jpg");
                uploadForm(formData);
              }, "image/jpeg", 0.9);
            };
          };
          reader.readAsDataURL(selectedFile);
        } else if (selectedFile.type === "application/pdf") {
          formData.append("file", selectedFile, selectedFile.name);
          uploadForm(formData);
        } else {
          alert("Only images or PDF files are allowed.");
          resetButton();
        }
      } else {
        uploadForm(formData);
      }
  
      function resetButton() {
        finalBtn.disabled = false;
        finalBtn.textContent = "Place Order";
        finalBtn.style.opacity = "1";
        finalBtn.style.cursor = "pointer";
      }
      
  
      function uploadForm(data) {
        fetch("https://etmsapi.tabcotechsoftware.com/api/QRPortal/PlaceOrder", {
          method: "POST",
          body: data
        })
          .then(res => res.json())
          .then(data => {
            if (document.body.contains(overlay)) {
              document.body.removeChild(overlay);
            }
  
            const isSuccess = data.success === true || data.success === "true";
  
            if (!isSuccess) resetButton();
  
            if (isSuccess) {
              document.querySelectorAll(".qty-input").forEach(i => i.value = "");
              document.querySelectorAll(".rate-input").forEach(i => i.value = "");
              document.querySelectorAll(".note-input").forEach(i => i.value = "");
              document.querySelectorAll("input.modern-input:not([readonly])").forEach(i => i.value = ""); 
              document.getElementById("total-qty").textContent = "0";
              document.getElementById("total-amt").textContent = "0.00";
            }
  
            showResultDialog({
              success: isSuccess,
              message: data.resultMessage?.trim() || (isSuccess
                ? "Your order has been placed successfully!"
                : "Something went wrong. Please try again.")
            });
          })
          .catch(err => {
            if (document.body.contains(overlay)) {
              document.body.removeChild(overlay);
            }
            resetButton();
            showResultDialog({ success: false, message: "Failed to place order: " + err.message });
          });
      }
    });
  
    dialog.appendChild(finalBtn);
  }
  
  
  
  
}


function showResultDialog({ success, message }) {
  const resultOverlay = document.createElement("div");
  resultOverlay.style.position = "fixed";
  resultOverlay.style.top = 0;
  resultOverlay.style.left = 0;
  resultOverlay.style.width = "100vw";
  resultOverlay.style.height = "100vh";
  resultOverlay.style.background = "rgba(0, 0, 0, 0.5)";
  resultOverlay.style.display = "flex";
  resultOverlay.style.justifyContent = "center";
  resultOverlay.style.alignItems = "center";
  resultOverlay.style.zIndex = 1000;

  const resultDialog = document.createElement("div");
  resultDialog.style.width = "90%";
  resultDialog.style.maxWidth = "420px";
  resultDialog.style.background = "#fff";
  resultDialog.style.padding = "30px";
  resultDialog.style.borderRadius = "12px";
  resultDialog.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  resultDialog.style.display = "flex";
  resultDialog.style.flexDirection = "column";
  resultDialog.style.alignItems = "center";
  resultDialog.style.gap = "16px";
  resultDialog.style.animation = "fadeIn 0.3s ease";

  
  const icon = document.createElement("img");
  icon.src = success
    ? "resources/success.png"
    : "resources/failure.png";  //  Now using your local files
  icon.alt = success ? "Success" : "Failure";
  icon.style.width = "64px";
  icon.style.height = "64px";

  const title = document.createElement("h2");
  title.textContent = success ? "Order Successful 🎉" : "Order Failed";
  title.style.textAlign = "center";

  const desc = document.createElement("p");
  desc.textContent = message;
  desc.style.textAlign = "center";
  desc.style.color = "#555";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.marginTop = "10px";
  closeBtn.className = "place-order-btn";
  closeBtn.onclick = () => {
    if (document.body.contains(resultOverlay)) {
      document.body.removeChild(resultOverlay);
    }
  };

  resultDialog.appendChild(icon);
  resultDialog.appendChild(title);
  resultDialog.appendChild(desc);
  resultDialog.appendChild(closeBtn);
  resultOverlay.appendChild(resultDialog);
  document.body.appendChild(resultOverlay);
}

//  Mobile QR Scanner Handler
document.addEventListener("click", async (e) => {
  if (e.target && (e.target.id === "add-item-btn" || e.target.id === "add-catelog-btn")) {
    console.log(" Add Item button clicked");

    const isCatelog = e.target.id === "add-catelog-btn";

    console.log(isCatelog ? "Catelog button clicked" : "Add button clicked");

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    // if (!isMobile) {
    //   alert("QR scanning is supported only on mobile devices.");
    //   return;
    // }

    const qrDialog = document.getElementById("qr-dialog");
    const qrContainer = document.getElementById("qr-reader");
    const closeBtn = document.getElementById("qr-close-btn");

    qrContainer.innerHTML = "";
    qrDialog.style.display = "flex";

    console.log("📦 Initializing Html5Qrcode");
    const html5QrCode = new Html5Qrcode("qr-reader");

    try {
      const cameras = await Html5Qrcode.getCameras();
      console.log("📷 Cameras found:", cameras);

      if (!cameras || cameras.length === 0) {
        alert("No camera found.");
        qrDialog.style.display = "none";
        return;
      }

      // Use back camera if found
      const backCamera = cameras.find(c =>
        c.label.toLowerCase().includes("back")
      ) || cameras[0];

      console.log("📷 Using camera:", backCamera.label);

      await html5QrCode.start(
        backCamera.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1  
        },
        (decodedText, decodedResult) => {
          console.log(" QR Code Scanned:", decodedText);
          // alert("QR Code: " + decodedText);

                  // Auto-close scanner
          html5QrCode.stop().then(() => {
            qrDialog.style.display = "none";
            qrContainer.innerHTML = "";
          });

          try {
            let idParam = "0";
            let qualIdParam = "0";
            let productIdParam = productId || "0"; // from global/context

            // Try parsing as URL to get 'id'
            try {
              const parsedUrl = new URL(decodedText);
              const urlId = parsedUrl.searchParams.get("id");
              if (urlId) {
                idParam = urlId;
              }
            } catch (urlError) {
              // Not a valid URL, ignore
            }

            // Try parsing as JSON to get 'QualId[0]'
            try {
              const parsedJson = JSON.parse(decodedText);
              const qualId = parsedJson?.data?.QualId?.[0];
              if (qualId) {
                qualIdParam = qualId;
              }
            } catch (jsonError) {
              // Not a valid JSON, ignore
            }

            const params = new URLSearchParams();
            params.append("Id", idParam);
            params.append("QualId", qualIdParam);
            params.append("ProductId", productIdParam);
            if (isCatelog) {
              params.append("type", "Catelog");
            }

            fetch("https://etmsapi.tabcotechsoftware.com/api/QRPortal/GetQualByQrId", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: params
            })
            .then(res => res.json())
            .then(data => {
              if (!data.success) {
                throw new Error(data.message || "Failed to fetch product.");
              }

              const currentAppName = document.querySelector(".site-title")?.textContent?.trim();
              const incomingAppName = data.appName?.trim();

              if (currentAppName !== incomingAppName) {
                showCustomDialog(
                  "Company Mismatch",
                  `This item is not from the ${currentAppName}.`
                );
                return;
              }

              if (Array.isArray(data.products) && data.products.length === 1) {
                const product = data.products[0];
                const alreadyExists = !!document.querySelector(`.qty-input[data-product-id="${product.id}"]`);
              
                if (alreadyExists) {
                  showCustomDialog("Already Added", "This item has already been added to your list.");
                  return;
                }
              
                // Append single product
                appendProductToList(product);
              } else {
                // Multiple products - skip duplicate check
                data.products.forEach(product => {
                  appendProductToList(product);
                });
              }
            })
            .catch(err => {
              console.error("❌ QR fetch error:", err);
              alert("Failed to load product from QR: " + err.message);
            });
          } catch (err) {
            alert("Invalid QR Code format.");
            console.error(err);
          }
        },
        (error) => {
          console.warn("⚠️ QR Scan Error:", error);
        }
      );

      // Close button handler
      closeBtn.onclick = () => {
        html5QrCode.stop().then(() => {
          qrDialog.style.display = "none";
          qrContainer.innerHTML = "";
          console.log(" Scanner closed manually");
        });
      };
    } catch (err) {
      console.error(" Camera access error:", err);
      // alert("Camera access denied or unavailable.");
      // qrDialog.style.display = "none";
    }
  }
});

function appendProductToList(product) {
  const container = document.getElementById("product-list");

  const productCard = document.createElement("div");
  productCard.className = "product-card";

  const layout = document.createElement("div");
  layout.className = "product-layout";

  // 🖼️ Image Slider
  const sliderWrapper = document.createElement("div");
  sliderWrapper.className = "product-slider";

  const swiperContainer = document.createElement("div");
  swiperContainer.className = "swiper";

  const swiperWrapper = document.createElement("div");
  swiperWrapper.className = "swiper-wrapper";

  product.images.forEach(imgUrl => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const anchor = document.createElement("a");
    anchor.href = imgUrl;

    const img = document.createElement("img");
    img.src = imgUrl;

    anchor.appendChild(img);
    slide.appendChild(anchor);
    swiperWrapper.appendChild(slide);
  });

  swiperContainer.appendChild(swiperWrapper);
  swiperContainer.innerHTML += `<div class="swiper-pagination"></div>`;
  sliderWrapper.appendChild(swiperContainer);

  // 📄 Product Details
  const details = document.createElement("div");
  details.className = "product-details";

  // ✅ Title + Delete Button Row
  const titleRow = document.createElement("div");
  titleRow.className = "product-title-row";

  const title = document.createElement("h1");
  title.textContent = product.name;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-button";
  deleteBtn.textContent = "Delete";
  deleteBtn.title = "Remove this item";

  deleteBtn.addEventListener("click", () => {
    const card = deleteBtn.closest(".product-card");
    if (card) {
      showDeleteConfirmDialog(() => {
        card.remove();
        updateTotals();
      });
    }
  });

  titleRow.appendChild(title);
  titleRow.appendChild(deleteBtn);
  details.appendChild(titleRow);

  const description = document.createElement("p");
  description.innerHTML = product.description.replace(/\\n/g, "<br>");
  details.appendChild(description);


  
  const price = parseFloat(product.price) || 0;
  const priceTag = document.createElement("p");
  priceTag.className = "price";
  priceTag.textContent = `₹${price}`;
  const pcsText = document.createElement("span");
  pcsText.style.fontSize = "16px";
  pcsText.style.color = "#4CAF50";
  pcsText.style.marginLeft = "10px";
  pcsText.textContent = `[ ${product.qPcs || 1} Matching Pcs ]`;

  priceTag.appendChild(pcsText);
  details.appendChild(priceTag);

  // 🧾 Row 1: Pcs + Set
  const row1 = document.createElement("div");
  row1.style.display = "flex";
  row1.style.gap = "10px";
  row1.style.flexWrap = "wrap";

  const qPcsWrapper = document.createElement("div");
  qPcsWrapper.className = "form-field";
  qPcsWrapper.style.display = "none";
  //qPcsWrapper.style.flex = "1";
  const qPcsLabel = document.createElement("label");
  qPcsLabel.textContent = "Matching";
  const qPcsInput = document.createElement("input");
  //qPcsInput.type = "number";
  qPcsInput.readOnly = true;
  qPcsInput.disabled = true;
  qPcsInput.style.border = "none";
  qPcsInput.style.background = "transparent";
  qPcsInput.style.pointerEvents = "none";
  qPcsInput.style.paddingLeft = "0"; 
  qPcsInput.className = "modern-input";
  qPcsInput.value = product.qPcs || 1;
  qPcsWrapper.appendChild(qPcsLabel);
  qPcsWrapper.appendChild(qPcsInput);

  const setWrapper = document.createElement("div");
  setWrapper.className = "form-field";
  setWrapper.style.flex = "1";
  const setLabel = document.createElement("label");
  setLabel.textContent = "Set";
  const setInput = document.createElement("input");
  setInput.type = "number";
  setInput.placeholder = "0";
  setInput.min = "0";
  setInput.className = "modern-input";
  setWrapper.appendChild(setLabel);
  setWrapper.appendChild(setInput);

  // 🧾 Row 2: Quantity + Amount
  // const row2 = document.createElement("div");
  // row2.style.display = "flex";
  // row2.style.gap = "20px";
  // row2.style.flexWrap = "wrap";
  // row2.style.marginTop = "10px";

  const qtyWrapper = document.createElement("div");
  qtyWrapper.className = "form-field";
  qtyWrapper.style.flex = "1";
  const qtyLabel = document.createElement("label");
  qtyLabel.textContent = "Quantity";
  const qtyInput = document.createElement("input");
  //qtyInput.type = "number";
  qtyInput.readOnly = true;
  qtyInput.disabled = true;
  qtyInput.style.border = "none";
  qtyInput.style.background = "transparent";
  qtyInput.style.pointerEvents = "none";
  qtyInput.style.paddingLeft = "0"; 
  qtyInput.className = "modern-input qty-input";
  qtyInput.value = "0";
  qtyWrapper.appendChild(qtyLabel);
  qtyWrapper.appendChild(qtyInput);

  const totalWrapper = document.createElement("div");
  totalWrapper.className = "form-field";
  totalWrapper.style.flex = "1";
  const totalLabel = document.createElement("label");
  totalLabel.textContent = "Amount";
  const totalInput = document.createElement("input");
  totalInput.type = "text";
  totalInput.readOnly = true;
  totalInput.disabled = true;
  totalInput.style.border = "none";
  totalInput.style.background = "transparent";
  totalInput.style.pointerEvents = "none";
  totalInput.style.paddingLeft = "0"; 
  totalInput.className = "modern-input-note";
  totalInput.value = "0.00";
  totalWrapper.appendChild(totalLabel);
  totalWrapper.appendChild(totalInput);

  // Auto update quantity & amount
  setInput.addEventListener("input", () => {
    const pcs = parseFloat(qPcsInput.value) || 0;
    const set = parseFloat(setInput.value) || 0;
    const qty = pcs * set;
    qtyInput.value = qty;
    totalInput.value = (qty * price).toFixed(2);
    updateTotals();
  });

  // Assign data-* attributes
  [qPcsInput, setInput, qtyInput].forEach(input => {
    input.dataset.productId = product.id;
    input.dataset.price = product.price;
    input.dataset.name = product.name;
    input.dataset.catelog = product.catelog;
    input.dataset.image = product.images?.[0] || "resources/placeholder.png";
  });
  setInput.dataset.qPcs = product.qPcs || 1;

  //row1.appendChild(qPcsWrapper);
  row1.appendChild(setWrapper);
  row1.appendChild(qtyWrapper);
  row1.appendChild(totalWrapper);
  details.appendChild(row1);
  // details.appendChild(row1);

  // Notes
  const noteWrapper = document.createElement("div");
  noteWrapper.className = "form-field";
  noteWrapper.style.marginTop = "16px";
  noteWrapper.style.width = "100%";
  const noteLabel = document.createElement("label");
  noteLabel.textContent = "Additional Notes";
  const noteInput = document.createElement("textarea");
  noteInput.placeholder = "Enter any remarks or notes...";
  noteInput.rows = 2;
  noteInput.className = "modern-input-note note-input";
  noteInput.dataset.productId = product.id;
  noteWrapper.appendChild(noteLabel);
  noteWrapper.appendChild(noteInput);

  details.appendChild(noteWrapper);
  layout.appendChild(sliderWrapper);
  layout.appendChild(details);
  productCard.appendChild(layout);
  container.appendChild(productCard);

  // Gallery & Swiper
  lightGallery(swiperWrapper, {
    selector: "a",
    plugins: [lgZoom, lgFullscreen],
    speed: 500
  });

  new Swiper(swiperContainer, {
    loop: true,
    pagination: {
      el: swiperContainer.querySelector(".swiper-pagination"),
      clickable: true
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  });
}


function showCustomDialog(title, message) {
  const dialog = document.getElementById("custom-dialog");
  const titleEl = document.getElementById("dialog-title");
  const messageEl = document.getElementById("dialog-message");

  if (!dialog || !titleEl || !messageEl) {
    console.error("Dialog elements not found in DOM.");
    return;
  }

  titleEl.textContent = title;
  messageEl.textContent = message;
  dialog.style.display = "flex";
}


function closeCustomDialog() {
  document.getElementById("custom-dialog").style.display = "none";
}

function showEnteredItemsDialog() {
  const enteredItemsList = document.getElementById("entered-items-list");
  enteredItemsList.innerHTML = "";

  const qtyInputs = document.querySelectorAll(".qty-input");
  let hasItems = false;

  qtyInputs.forEach((qtyInput) => {
    const quantity = parseFloat(qtyInput.value) || 0;
    if (quantity <= 0) return;

    hasItems = true;

    const name = qtyInput.dataset.name;
    const imageUrl = qtyInput.dataset.image || "resources/placeholder.png";
    const price = parseFloat(qtyInput.dataset.price) || 0;

    const productId = qtyInput.dataset.productId;
    const pcsInput = document.querySelector(`input[type="number"][readonly].modern-input[data-product-id="${productId}"]`);
    const setInput = document.querySelector(`input[type="number"].modern-input[data-product-id="${productId}"]:not([readonly])`);

    const pcs = parseFloat(pcsInput?.value || 0);
    const set = parseFloat(setInput?.value || 0);
    const total = quantity * price;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "flex-start";
    row.style.gap = "12px";
    row.style.padding = "12px 0";
    row.style.borderBottom = "1px solid #eee";

    // 🔸 Image
    const imgCol = document.createElement("div");
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = name;
    img.style.width = "48px";
    img.style.height = "48px";
    img.style.borderRadius = "6px";
    img.style.objectFit = "cover";        // ✅ fills the box
    img.style.objectPosition = "top";     // ✅ align content from top
    img.style.display = "block";          // ✅ removes baseline alignment gap
    imgCol.appendChild(img);

    // 🔸 Name + Calculation (Stacked vertically)
    const textCol = document.createElement("div");
    textCol.style.display = "flex";
    textCol.style.flexDirection = "column";
    textCol.style.alignItems = "flex-start";      // force left-align
    textCol.style.justifyContent = "flex-start";  // force top-align
    textCol.style.flex = "1";

    const nameEl = document.createElement("div");
    nameEl.textContent = name;
    nameEl.style.fontWeight = "600";
    nameEl.style.fontSize = "15px";

    const calcEl = document.createElement("div");
    calcEl.textContent = `(${pcs} × ${set} = ${quantity} × ${price} = ${total.toFixed(2)})`;
    calcEl.style.fontSize = "13px";
    calcEl.style.color = "#777";
    calcEl.style.marginTop = "2px";

    textCol.appendChild(nameEl);
    textCol.appendChild(calcEl);

    // 🔸 Quantity (Right aligned)
    const qtyCol = document.createElement("div");
    qtyCol.textContent = quantity;
    qtyCol.style.flex = "0 0 60px";
    qtyCol.style.textAlign = "right";
    qtyCol.style.fontWeight = "500";

    row.appendChild(imgCol);
    row.appendChild(textCol);
    row.appendChild(qtyCol);

    enteredItemsList.appendChild(row);
  });

  if (!hasItems) {
    enteredItemsList.innerHTML = "<p>No items with quantity entered yet.</p>";
  }

  document.getElementById("entered-items-dialog").style.display = "flex";
}






function closeEnteredItemsDialog() {
  document.getElementById("entered-items-dialog").style.display = "none";
}

document.getElementById("show-entered-items-btn").addEventListener("click", showEnteredItemsDialog);

function showDeleteConfirmDialog(onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "custom-dialog-overlay";

  const dialog = document.createElement("div");
  dialog.className = "custom-dialog";

  const title = document.createElement("h2");
  title.textContent = "Delete Item?";

  const message = document.createElement("p");
  message.textContent = "Are you sure you want to delete this item?";

  const btnGroup = document.createElement("div");
  btnGroup.style.display = "flex";
  btnGroup.style.justifyContent = "center";
  btnGroup.style.gap = "12px";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "place-order-btn";
  cancelBtn.style.backgroundColor = "#ccc";
  cancelBtn.onclick = () => document.body.removeChild(overlay);

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Delete";
  confirmBtn.className = "place-order-btn";
  confirmBtn.style.backgroundColor = "#e53935";
  confirmBtn.onclick = () => {
    document.body.removeChild(overlay);
    onConfirm(); // 👉 Trigger actual delete
  };

  btnGroup.appendChild(cancelBtn);
  btnGroup.appendChild(confirmBtn);

  dialog.appendChild(title);
  dialog.appendChild(message);
  dialog.appendChild(btnGroup);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}


