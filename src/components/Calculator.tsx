import { useEffect } from "react"
import { view, store } from "react-easy-state"

type Method = '+' | '-' | '/' | '*'

const state = store({
  actions: ['0'],
  currentMethod: '',
  allowedMethods: ['+', '-', '*', '/'],
  printSum() {
    let actions = state.actions.join("")
    if (state.allowedMethods.includes(actions.slice(-1))) {
      actions = actions.slice(0, -1)
    }
    return eval(actions)
  },
  printActions() {
    return `${state.actions.join("")}${state.currentMethod || ''}` 
  },
  clear() {
    state.actions = ['0']
    state.currentMethod = ''
  },
  equal() {
    state.actions = [eval(state.actions.join("")).toString()]
    state.currentMethod = ''
  },
  del() {
    if (state.currentMethod) {
      return state.currentMethod = ''
    }
    const last = state.getLastAction()
    let afterDel = last.slice(0, -1)
    if (!afterDel) {
      if (state.actions.length > 1) {
        return state.actions.pop()
      }
      return state.clear()
    }
    state.actions[state.actions.length - 1] = afterDel
  },
  setMethod(method: Method) {
    const last = state.getLastAction()
    if (state.currentMethod) return
    if (last.slice(-1) == '.') return
    state.currentMethod = method
  },
  getLastAction() {
    return state.actions[state.actions.length - 1]
  },
  appendAction(num: string) {
    state.actions[state.actions.length - 1] += num
  },
  typeNumber(num: string) {
    if (state.currentMethod && num == '.') return
    const last = state.getLastAction()
    if (last == '0' && num == '0') return 
    if (last == '0' && num != '.') {
      return state.actions[state.actions.length - 1] = num
    }
    if (last.includes('.') && num == '.') return

    if (!state.currentMethod) {
      return state.appendAction(num)
    }
    state.appendAction(`${state.currentMethod}${num}`)
    state.currentMethod = ''
  }
})

const Calculator = () => {

  useEffect(() => {
    const onKeyPress = ({ key }: any) => {
      if (key == 'Escape') {
        return state.clear()
      }
      if (state.allowedMethods.includes(key)) {
        return state.setMethod(key)
      }
      if (!isNaN(key) || key == '.') {
        return state.typeNumber(key)
      }
      if (key == 'Backspace') {
        return state.del()
      }
      if (key == 'Enter') {
        return state.equal()
      }
    }
    document.addEventListener('keyup', onKeyPress)
    return () => {
      document.removeEventListener('keyup', onKeyPress)
    }
  })

  return (
    <div className="wrapper">
      <div className="expo-bridge">
        <div className="last-action">{state.printActions()}</div>
        <div className="current-action">{state.printSum()}</div>
      </div>
      <button className="span-two" onClick={state.clear}>AC</button>
      <button onClick={state.del}>DEL</button>
      <Method method="/" onClick={state.setMethod} />
      <Digit digit="1" onClick={state.typeNumber} />
      <Digit digit="2" onClick={state.typeNumber} />
      <Digit digit="3" onClick={state.typeNumber} />
      <Method method="*" onClick={state.setMethod} />
      <Digit digit="4" onClick={state.typeNumber} />
      <Digit digit="5" onClick={state.typeNumber} />
      <Digit digit="6" onClick={state.typeNumber} />
      <Method method="+" onClick={state.setMethod} />
      <Digit digit="7" onClick={state.typeNumber} />
      <Digit digit="8" onClick={state.typeNumber} />
      <Digit digit="9" onClick={state.typeNumber} />
      <Method method="-" onClick={state.setMethod} />
      <Digit digit="." onClick={state.typeNumber} />
      <Digit digit="0" onClick={state.typeNumber} />
      <button className="span-two" onClick={() => state.equal()}>=</button>
      Made with {'<3'} by Raz Buchnik
    </div>
  )
}

export default view(Calculator)

interface DigitParams {
  digit: string;
  onClick: typeof state.typeNumber;
}
const Digit = ({ digit, onClick }: DigitParams) => {
  return <button onClick={() => onClick(digit)}>{digit}</button>
}

interface MethodParams {
  method: Method;
  onClick: typeof state.setMethod;
}
const Method = ({ method, onClick }: MethodParams) => {
  return <button onClick={() => onClick(method)}>{method}</button>
}