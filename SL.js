 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
     apiKey: "AIzaSyA_izVA-dxQ7ugvA8_TJS-M16VWYBoxRLI",
     authDomain: "shoppinglist-ace1b.firebaseapp.com",
     projectId: "shoppinglist-ace1b",
     storageBucket: "shoppinglist-ace1b.appspot.com",
     messagingSenderId: "319641744594",
     appId: "1:319641744594:web:df3659a152bc3fa165290b"
   };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 import { getDatabase, ref, remove, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js"
 const db = getDatabase(app, "https://shoppinglist-ace1b-default-rtdb.europe-west1.firebasedatabase.app")
 
 
 const inputField = document.getElementById("input-field")
 const listItems = document.querySelector(".list-items")
 const demo = document.getElementById("demo")
 const listEmpty = document.getElementById("list-empty")
 const range = document.querySelector(".range")
 const bubble = document.querySelector(".bubble")
 const fontSize = document.getElementById("font-size")
 const switchSlider = document.querySelector("#switch-slider")
 const sliderTwo = document.querySelector(".slider-two")
 const slider = document.querySelector(".slider")
 const fontSizeMinusBtn = document.getElementById("font-size-minus")
 const fontSizePlusBtn = document.getElementById("font-size-plus")
 const rangeWrap = document.querySelector(".range-wrap")
 const fontSizeBarMinus = document.getElementById("font-size-bar-minus")
 const fontSizeBarPlus = document.getElementById("font-size-bar-plus")
 let fontSizeBar = ""
 
 onValue(ref(db,`settings/font-size`), (snapshot)=>{
     
     let fontSizeFromDB = snapshot.val().fontSize
     listItems.style.fontSize = `${fontSizeFromDB}px`
     fontSize.value = fontSizeFromDB
     range.value = fontSizeFromDB
     bubble.innerHTML = `${fontSizeFromDB}`
     bubble.style.left = `${(range.value-16) * (100 / (36 - 16))}%`  
 }
 )

 onValue(ref(db,`settings/fontSizeBar`), (snapshot)=>{
    fontSizeBar = snapshot.val().fontSizeBar
    if (fontSizeBar == "off") {
        hideSlider()
    } else {
        hideSliderTwo()
    }
 })

 onValue(ref(db,"itemsToBuy/"), (snapshot) => {
     inputField.focus()
     if (!snapshot.exists()) {  
         listEmpty.textContent = "Your list is empty"
         listItems.innerHTML = ""
     } else {
         listEmpty.textContent = ""
 
     var unique =[]
     listItems.innerHTML = ""
 
     let itemsToBuyArray = Object.entries(snapshot.val())
     
     for (let i = 0; i < itemsToBuyArray.length; i++){
 
         let currentItem = itemsToBuyArray[i]
         let currentItemId = currentItem[0]
         let currentItemValue = currentItem[1]
         
         if (!unique.includes(currentItemValue)){
             unique.push(currentItemValue)} else {        
                 alert(`${currentItemValue} is already in the list!`)
                 demo.innerHTML = currentItemId
                 remove(ref(db,"itemsToBuy/" + currentItemId))
                 location.reload()
             }
 
    
         let itemList = document.createElement("li")
         itemList.textContent = upperCase(currentItemValue)
         listItems.append(itemList)
         
         
         itemList.addEventListener("click", () => {
             remove(ref(db,"itemsToBuy/" + currentItemId))
             inputField.blur()
         })   
         
         itemList.addEventListener("mouseover", () => {
             itemList.style.translate = "0px -3px"
             itemList.style.opacity = "0.5"
             itemList.style.transition = "100ms"
         })
             
         itemList.addEventListener("mouseout", () => {
                 itemList.style.translate = "0px 3px"
                 itemList.style.opacity = "1"
             })
     }}
     })
   
 
 inputField.addEventListener("keypress", (e) => {
     if (e.key === "Enter") {
         push( ref(db,"itemsToBuy/"), inputField.value.toLowerCase())
         inputField.value = ""
         inputField.placeholder = "Add a new item and press Enter"
         inputField.blur()
     }
 })
 inputField.addEventListener("mouseleave", () => {
    inputField.placeholder = "Add a new item and press Enter"
    inputField.style.backgroundColor = "#f9e1b4"
    
})

 inputField.addEventListener("click", () => {
    inputField.placeholder = ""
    inputField.style.color = "#504f4d"    
})
 
 range.addEventListener("touchstart", () => {
     
     bubble.style.transform = "scale(1)"
     bubble.style.transition = "150ms"
     bubble.innerHTML = `${range.value}`
     bubble.style.left = `${(range.value-16) * (100 / (36 - 16))}%`
     fontSize.textContent = range.value
 })
 

 range.addEventListener("touchmove", () => {
     listItems.style.fontSize = `${range.value}px`
     bubble.style.transition = "0ms"
     bubble.innerHTML = `${range.value}`
     bubble.style.left = `${(range.value-16) * (100 / (36 - 16))}%`
 })
 
 range.addEventListener("touchend", () => {
     bubble.style.transform = "scale(0)"
     fontSize.value = range.value
     set( ref(db,"settings/font-size"), {
         fontSize: range.value
     })

 })


 
switchSlider.addEventListener("click",()=> {
    if (fontSizeBar == "on") {
        switchSlider.innerHTML = "Font size bar"
        hideSlider()
        set (ref(db, "settings/fontSizeBar"), {fontSizeBar : "off"})
        fontSizeBar = "off"
        }
    else if (fontSizeBar == "off") {
        switchSlider.innerHTML = "Input font size"
        hideSliderTwo()
        set (ref(db, "settings/fontSizeBar"), {fontSizeBar : "on"})
        fontSizeBar = "on"
    }
  })

 
fontSize.addEventListener("click", () => {
    fontSize.select()
})


 fontSize.addEventListener("keypress", (e)=>{
    if (e.key === "Enter") {

        listItems.style.fontSize = fontSize.value
        set( ref(db,"settings/font-size"), {
            fontSize: fontSize.value})
     }
     fontSize.blur()
    })
 
 
 fontSizeMinusBtn.addEventListener("click", ()=>{
     fontSize.value = Number(fontSize.value) - 1
     listItems.style.fontSize = `${fontSize.value}px`
     set( ref(db,"settings/font-size"), {
         fontSize: fontSize.value})
     })
 
 fontSizePlusBtn.addEventListener("click", ()=>{
     fontSize.value = Number(fontSize.value) + 1
     listItems.style.fontSize = `${fontSize.value}px`
     set( ref(db,"settings/font-size"), {
         fontSize: fontSize.value})
     })
 
 function upperCase(str) {
     let firstLetter = str.charAt(0)
     firstLetter = firstLetter.toUpperCase()
     let otherLetters = str.slice(1)
     return firstLetter + otherLetters
 }

 function hideSlider() {
    slider.style.height = "0"
    rangeWrap.style.transform = "scale(0)"
    fontSizeBarMinus.style.fontSize = "0"
    fontSizeBarPlus.style.fontSize = "0"
    sliderTwo.style.height = "fit-content"
    sliderTwo.style.margin = "30px"
    fontSizeMinusBtn.style.fontSize = "18px"
    fontSizeMinusBtn.style.padding = "8px 20px"
    fontSizePlusBtn.style.fontSize = "18px"
    fontSizePlusBtn.style.padding = "8px 20px"
    fontSize.style.height = "auto"
    fontSize.style.padding = "6px"

}

function hideSliderTwo () {
    sliderTwo.style.height = "0"
    fontSizeMinusBtn.style.fontSize = "0px"
    fontSizeMinusBtn.style.padding = "0px"
    fontSizePlusBtn.style.fontSize = "0px"
    fontSizePlusBtn.style.padding = "0px"
    fontSize.style.height = "0px"
    fontSize.style.padding = "0px"
    slider.style.height = "fit-content"
    sliderTwo.style.margin = "10px"
    rangeWrap.style.transform = "scale(1)"
    fontSizeBarMinus.style.fontSize = "18px"
    fontSizeBarPlus.style.fontSize = "18px"
}

 
