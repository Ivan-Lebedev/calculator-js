const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const sqrtButton = document.querySelector('[data-operation-sqrt]')
const plusMinusButton = document.querySelector('[data-plus-minus]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        this.currentOperand = String(this.currentOperand).slice(0, -1)
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = String(this.currentOperand) + String(number)
    }
    choseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }
    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (!isNaN(prev) && this.operation === '√') {
            computation = Math.sqrt(prev * 1e10)
            this.currentOperand = computation / Math.sqrt(1e10)
            this.operation = undefined
            this.previousOperand = ''
            // this.updateDisplay()
        }
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation = (prev * 1e10 + current * 1e10) / 1e10
                break
            case '-':
                computation = (prev * 1e10 - current * 1e10) / 1e10
                break
            case '*':
                computation = (prev * 1e10 * current * 1e10) / 1e10 / 1e10
                break
            case '÷':
                computation = prev / current
                break
            case '^':
                computation = prev ** current
                break
            default:
                return
        }
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }
    getDisplayNumber(number) {
        const stringNumber = String(number)
        if (isNaN(number)) {
            return 'Error, press AC'
        }
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay

        if (isNaN(integerDigits)) {
            integerDisplay = '0'
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }
    updateDisplay() {
        if (this.currentOperand === '.') {
            this.currentOperandTextElement.innerText = '0.'
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
            if (this.operation === '√') {
                this.previousOperandTextElement.innerText =
                    `${this.operation} (${this.getDisplayNumber(this.previousOperand)})`
            } else if (this.operation != null) {
                this.previousOperandTextElement.innerText =
                    `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
            } else {
                this.previousOperandTextElement.innerText = ''
            }
        }

    }
    toggleMinus() {
        this.currentOperand = -this.currentOperand
    }
}

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.choseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

sqrtButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

plusMinusButton.addEventListener('click', button => {
    calculator.toggleMinus()
    calculator.updateDisplay()
})