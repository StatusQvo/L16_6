const tasks = [
  {
    id: '1138465078061',
    completed: false,
    text: 'Посмотреть новый урок по JavaScript',
  },
  {
    id: '1138465078062',
    completed: false,
    text: 'Выполнить тест после урока',
  },
  {
    id: '1138465078063',
    completed: false,
    text: 'Выполнить ДЗ после урока',
  },
]

class SetNewLesson {
  constructor(id, status, textTask) {
    this.taskID = id
    this.completed = status
    this.textTask = textTask
  }

  createTaskCommonElt() {
    let TaskElt = document.createElement('div')
    TaskElt.className = 'task-item'
    TaskElt.dataset.taskId = this.taskID
    return TaskElt
  }

  createCheckBoxAndTaskSPAN() {
    ///// form for Elt
    const checkBoxForm = document.createElement('form')
    checkBoxForm.className = 'checkbox-form'

    ////// CheckBox Elt
    const CheckBoxElt = document.createElement('input')
    CheckBoxElt.type = 'checkbox'
    CheckBoxElt.className = 'checkbox-form__checkbox'
    CheckBoxElt.id = `task-${this.taskID}`

    ////// CheckBoX label
    const label4CheckBox = document.createElement('label')
    label4CheckBox.htmlFor = CheckBoxElt.id

    ///// Span
    const taskSpan = document.createElement('span')
    taskSpan.className = 'task-item__text'
    taskSpan.innerText = this.textTask

    //// checkBoX -> DOM
    checkBoxForm.append(CheckBoxElt, label4CheckBox)
    //
    return [checkBoxForm, taskSpan]
  }

  createDeleteButton() {
    const deleteButton = document.createElement('button')
    deleteButton.className =
      'task-item__delete-button default-button delete-button'
    deleteButton.innerHTML = 'Удалить'
    return deleteButton
  }

  createAndPutTaskRow() {
    const TaskList = document.querySelector('.tasks-list')
    const TaskROW = this.createTaskCommonElt()
    const [checkBox, taskSpan] = this.createCheckBoxAndTaskSPAN()
    const DeleteButton = this.createDeleteButton()

    //// Container //// Content + deleteButton
    const TaskItemMainContainer = document.createElement('div')
    TaskItemMainContainer.className = 'task-item__main-container'

    //// Content /// CheckBox + SpanText
    const TaskItemMainContent = document.createElement('div')
    TaskItemMainContent.className = 'task-item__main-content'

    /////Append ALL Elts
    TaskList.insertAdjacentElement('beforeend', TaskROW)
    TaskROW.insertAdjacentElement('beforeend', TaskItemMainContainer)
    TaskItemMainContainer.append(TaskItemMainContent, DeleteButton)
    TaskItemMainContent.append(checkBox, taskSpan)
  }
}

//////START//////////
function formingTaskList() {
  tasks.forEach((task) => {
    let everyTask = new SetNewLesson(task.id, task.completed, task.text)
    everyTask.createAndPutTaskRow()
  })
}

formingTaskList()

//////// SUBMIT Action ///////////
const formBlockSubmit = document.querySelector('.create-task-block')
formBlockSubmit.addEventListener('submit', submitEvent)

//// Event
function submitEvent(event) {
  event.preventDefault()
  const { target } = event
  const newLesson = target.taskName.value
  checkNewTaskValid(newLesson.trim())
}

//// create SPAN for Error Message/////////////
const createSpanElt = (ErrorMessage) => {
  const ErrorMsgBlock = document.createElement('span')
  ErrorMsgBlock.setAttribute('class', 'error-message-block')
  ErrorMsgBlock.innerText = ErrorMessage
  return ErrorMsgBlock
}

//// create new Lesson ELT if check Valid /////////////////
function createNewTaskRow(newLessonName) {
  const lastId = String(Date.now())
  const newTaskRow = new SetNewLesson(lastId, false, newLessonName)
  newTaskRow.createAndPutTaskRow()

  ////Add 2 Array
  tasks.push({ id: lastId, completed: false, text: newLessonName })
}

//////// check New Lesson for Error MSG
function checkNewTaskValid(lessonName) {
  const ErrorText_Empty = 'Название задачи не должно быть пустым'
  const ErrorText_Exist = 'Задача с таким названием уже существует.'

  ///Creates Array to check original TaskName
  const taskNameArr = tasks.map(({ text }) => {
    return text
  })

  ////4 check if span exist
  let errorSpan = formBlockSubmit.querySelector('span')

  // Check Condition
  if (!lessonName) {
    //if input EMPTY

    if (errorSpan) {
      //if ERROR span ALREADY exist
      errorSpan.innerHTML = ErrorText_Empty
    } else {
      //Create a new ERROR SPAN
      const NewErrorSpan = createSpanElt(ErrorText_Empty)
      formBlockSubmit.insertAdjacentElement('beforeend', NewErrorSpan)
    }
  } else if (taskNameArr.includes(lessonName)) {
    // if ERROR for Repeated input
    if (errorSpan) {
      //if ERROR span ALREADY exist
      errorSpan.innerHTML = ErrorText_Exist
    } else {
      //Create a new ERROR SPAN
      const NewErrorSpan = createSpanElt(ErrorText_Exist)
      formBlockSubmit.insertAdjacentElement('beforeend', NewErrorSpan)
    }
  } else {
    //NO ERROR (input filled right)
    if (errorSpan) errorSpan.remove() //if exist ERROR Span
    createNewTaskRow(lessonName)
  }
}

//////// DELETE BUTTON////////////

///create Error Buttons
const createErrorButtons = () => {
  const errorButtonsContainer = document.createElement('div')
  errorButtonsContainer.setAttribute('class', 'delete-modal__buttons')
  ///Buttons
  const cancelB = document.createElement('button')
  cancelB.innerText = 'Отменить'
  cancelB.setAttribute(
    'class',
    'delete-modal__button delete-modal__cancel-button'
  )
  const confirmB = document.createElement('button')
  confirmB.innerText = 'Удалить'
  confirmB.setAttribute(
    'class',
    'delete-modal__button delete-modal__confirm-button'
  )

  errorButtonsContainer.append(cancelB, confirmB)
  return errorButtonsContainer
}

//Main Container & Main Content & Error Message
const createErrContainerANDmsg = () => {
  //Container
  const mainConteiner = document.createElement('div')
  mainConteiner.setAttribute('class', 'modal-overlay')
  mainConteiner.classList.add('modal-overlay_hidden')

  //Content
  const mainContent = document.createElement('div')
  mainContent.setAttribute('class', 'delete-modal')

  //Error Message
  const deleteMSG = document.createElement('h3')
  deleteMSG.setAttribute('class', 'delete-modal__question')
  deleteMSG.textContent = 'Вы действительно хотите удалить эту задачу?'

  return [mainConteiner, mainContent, deleteMSG]
}

//Form MODAL WINDOW ELTs
function createModalWindow() {
  //Error Buttons
  const Buttons = createErrorButtons()

  //Main Container & Main Content & ErrMSG_h3
  const [mainConteiner, mainContent, deleteMSG] = createErrContainerANDmsg()

  mainContent.append(deleteMSG, Buttons)
  mainConteiner.append(mainContent)
  return [mainConteiner, Buttons]
}

//modal Win insert in DOM
insertModalWinELT()

function insertModalWinELT() {
  const taskListForm = document.querySelector('[class="tasks-list"]')
  const [mainConteiner, Buttons] = createModalWindow()
  const modalWindow = taskListForm.querySelector('.modal-overlay')

  //input hidden modal window
  taskListForm.prepend(mainConteiner)

  ////GO-GO Delete Action
  deleteFunc()
  //Delete Button
  //taskListForm.addEventListener('click', deleteFunc)
}

function deleteFunc() {
  const modalWindow = document.querySelector('.modal-overlay')
  const bConfirm = modalWindow.querySelector('button[class$="confirm-button"]')
  const bCancel = modalWindow.querySelector('button[class$="cancel-button"]')
  const taskListForm = modalWindow.closest('div.tasks-list')

  let taskID2Delete = null //determine later in delete button push

  ////ACTION
  bConfirm.addEventListener('click', () => {
    if (taskID2Delete) {
      let row2Deelete = taskListForm.querySelector(
        `[data-task-id="${taskID2Delete}"]`
      )

      if (row2Deelete) {
        row2Deelete.remove()
        modalWindow.classList.add('modal-overlay_hidden')
      } //row exist

      //find ID in tasks and delete
      let taskIndex2Del = tasks.findIndex(({ id }) => {
        return id === taskID2Delete
      })
      //check ID and delete
      if (taskIndex2Del > -1) {
        tasks.splice(taskIndex2Del, 1)
      }
    } //ID2Delete exist
  }) //Event on BConfirm

  bCancel.addEventListener('click', () => {
    taskID2Delete = null
    modalWindow.classList.add('modal-overlay_hidden')
  }) //Event on BCancel

  taskListForm.addEventListener('click', (event) => {
    const { target } = event
    //CHECK target = button 2 delete
    const button4Check = [...target.classList]
    const buttonDel = button4Check.includes('delete-button')

    //Pressed button & ONLY Del button
    if (target.localName === 'button' && buttonDel) {
      taskID2Delete = target.parentNode.parentNode?.dataset?.taskId
      modalWindow.classList.remove('modal-overlay_hidden')
    }
  })
}

////CHANGE SITE THEME COLOR
//Function
const windowThemeChange = ({
  Background,
  TextColor,
  ButtonsBorder,
  isDarkTheme,
}) => {
  //background
  document.body.style.background = Background

  //Text color
  document.querySelectorAll('.task-item').forEach((taskRow) => {
    taskRow.style.color = TextColor
  })
  //Buttons Color
  document.querySelectorAll('button').forEach((buttonElt) => {
    buttonElt.style.border = ButtonsBorder
  })

  //CheckBox Color
  const taskList = document.querySelector('.tasks-list')
  const taskLabel = taskList.querySelectorAll('label')
  taskList.querySelectorAll('input').forEach((inputVal, index) => {
    //Change classes because JS can't operate pseudoelement ::before
    if (isDarkTheme) {
      //input and label goes together with same index
      inputVal.classList.replace('checkbox-form__checkbox', 'isDark__checkbox')
      taskLabel[index].classList.add('label__isDark')
    } else {
      inputVal.classList.replace('isDark__checkbox', 'checkbox-form__checkbox')
      taskLabel[index].classList.remove('label__isDark')
    }
  })
}

////THEME CHANGE ACTION
window.addEventListener('keydown', (event) => {
  const { code } = event
  let isDark = false
  ///TAB
  if (code === 'Tab') {
    event.preventDefault()
    //CHECK THEME: Dark or White
    let someButtonELT = document.querySelector('button')
    let SomeBStyle = someButtonELT.style.border
    let isDark = Boolean(SomeBStyle === 'none') || !SomeBStyle

    //if DARK OR WHITE
    if (isDark) {
      windowThemeChange({
        Background: '#24292E',
        TextColor: '#ffffff',
        ButtonsBorder: '1px solid #ffffff',
        isDarkTheme: isDark,
      })
    } else {
      windowThemeChange({
        Background: 'initial',
        TextColor: 'initial',
        ButtonsBorder: 'none',
        isDarkThemer: isDark,
      })
    }
  }
})
