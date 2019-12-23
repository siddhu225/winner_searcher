const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const messageFour = document.querySelector('#message-4')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = search.value


    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    messageThree.textContent = ''
    messageFour.textContent = ''

    fetch('/winner?name=' + name).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = 'Field (chemistry/physics etc):   ' + data.persons[0].prizes[0].category;
                messageTwo.textContent = 'Country of the winner:  ' + data.persons[0].bornCountry;
                messageThree.textContent = 'The year they won the prize:  ' + data.persons[0].prizes[0].year;   
                messageFour.textContent = 'all they shared the prize with: ' + data.names[0];
            }
        })
    })
})