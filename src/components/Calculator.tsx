import { useEffect } from "react"
import { view, store } from "react-easy-state"
import { makeCache } from "../utils/cache"

type Method = '+' | '-' | '/' | '*'

const state = store({
  actions: ['0'],
  currentMethod: '',
  allowedMethods: ['+', '-', '*', '/'],
  printSum: makeCache((actionsArr: string[]) => {
    let actions = actionsArr.join("")
    if (state.allowedMethods.includes(actions.slice(-1))) {
      actions = actions.slice(0, -1)
    }
    return eval(actions)
  }),
  printActions: makeCache((actions: string[], currentMethod: string) => {
    return `${actions.join("")}${currentMethod || ''}` 
  }),
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
  getLastAction() {
    return state.actions[state.actions.length - 1]
  },
  appendAction(num: string) {
    state.actions[state.actions.length - 1] += num
  },
  setMethod(method: Method) {
    const last = state.getLastAction()
    if (state.currentMethod) return
    if (last.slice(-1) == '.') return
    state.currentMethod = method
  },
  setNumber(num: string) {
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
        return state.setNumber(key)
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
  }, [])

  return (
    <div className="wrapper">
      <div className="expo-bridge">
        <div className="last-action">{state.printActions(state.actions, state.currentMethod)}</div>
        <div className="current-action">{state.printSum(state.actions)}</div>
      </div>
      <button className="span-two" onClick={state.clear}>AC</button>
      <button onClick={state.del}>DEL</button>
      <Method method="/" onClick={state.setMethod} />
      <Digit digit="1" onClick={state.setNumber} />
      <Digit digit="2" onClick={state.setNumber} />
      <Digit digit="3" onClick={state.setNumber} />
      <Method method="*" onClick={state.setMethod} />
      <Digit digit="4" onClick={state.setNumber} />
      <Digit digit="5" onClick={state.setNumber} />
      <Digit digit="6" onClick={state.setNumber} />
      <Method method="+" onClick={state.setMethod} />
      <Digit digit="7" onClick={state.setNumber} />
      <Digit digit="8" onClick={state.setNumber} />
      <Digit digit="9" onClick={state.setNumber} />
      <Method method="-" onClick={state.setMethod} />
      <Digit digit="." onClick={state.setNumber} />
      <Digit digit="0" onClick={state.setNumber} />
      <button className="span-two" onClick={() => state.equal()}>=</button>
    </div>
  )
}

export default view(Calculator)

interface DigitParams {
  digit: string;
  onClick: typeof state.setNumber;
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
