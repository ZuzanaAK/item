let categories =  [...document.getElementById('category-input').children]
let currentCategory = document.getElementById('category-item').innerHTML;
let operations =  [...document.getElementById('operation-input').children]
let currentOperation = document.getElementById('operation-item').innerHTML;

categories.forEach(category => {
    if (category.innerHTML === currentCategory) {
      category.setAttribute('selected', 'selected')
    }
  })

operations.forEach(operation => {
    if (operation.innerHTML === currentOperation) {
      operation.setAttribute('selected', 'selected')
    }
  })