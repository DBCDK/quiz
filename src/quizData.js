export const dispatchActionData = ({score, screen, trophyImage}) => ({
  condition: {atLeast: {score: score || 0}},
  action: {
    screen,
    set: {trophy: {image: trophyImage || ''}},
    callback: true
  }
});
export const infoScreenData = ({_id, parent, action, text, buttonText}) => ({
  _id,
  parent,
  ui: [
    {
      type: 'media',
      url: ''
    },
    {
      type: 'text',
      text: text || 'Forklaring af resultatet'
    },
    {
      type: 'button',
      color: 'primary',
      text: buttonText || 'videre',
      action
    }
  ],
  log: true
});
export const answerButtonData = ({nextScreen, score, text}) => ({
  type: 'button',
  color: 'primary',
  text: text || 'Tekst på svarknap',
  action: {
    screen: nextScreen,
    increment: {score: score || 0, correct: score || 0, questionCount: 1}
  }
});
export const questionSectionData = ({id, nextScreen, questionText}) => ({
  [id]: {
    _id: id,
    nextSection: nextScreen,
    ui: [
      {
        type: 'media',
        url: ''
      },
      {type: 'text', text: questionText || 'Spørgsmål?'},
      {
        type: 'buttonGroup',
        ui: [
          answerButtonData({nextScreen: id + 'answer1', text: 'Svar A'}),
          answerButtonData({
            nextScreen: id + 'answer2',
            score: 1,
            text: 'Svar B'
          })
        ]
      },
      {type: 'spacing'},
      {
        type: 'button',
        color: 'secondary',
        text: 'hjælp',
        action: {screen: id + 'help'}
      }
    ]
  },
  [id + 'help']: infoScreenData({
    _id: id + 'help',
    parent: id,
    action: {screen: id},
    text: 'Her er et hint...'
  }),
  [id + 'answer1']: infoScreenData({
    _id: id + 'answer1',
    parent: id,
    action: {screen: nextScreen},
    text: '# Forkert/Rigtigt svar\n\nDet rigtige svar er ... fordi...'
  }),
  [id + 'answer2']: infoScreenData({
    _id: id + 'answer2',
    parent: id,
    action: {screen: nextScreen},
    text: '# Rigtigt/Forkert svar\n\nDet var rigtigt fordi...'
  })
});
export const quizData = () => ({
  _type: 'quiz',
  _id: 'quizId',
  title: 'Titel for ny quiz',
  description: 'Beskrivelse af den nye quiz',
  tags: ['nøgleord1', 'nøgleord2'],
  style: {
    primaryColor: '#0b6f9f',
    secondaryColor: '#768e87'
  },
  start: 'quizIntro',
  screens: {
    quizIntro: {
      start: true,
      nextSection: 'quizQuestion1',
      ...infoScreenData({
        _id: 'quizIntro',
        text: '# Velkommen til quizzen\n\n Tilføj mere intro-tekst her...',
        buttonText: 'Start',
        action: {
          screen: 'quizQuestion1',
          set: {
            score: 0,
            correct: 0,
            questionCount: 0
          }
        }
      })
    },
    ...questionSectionData({
      id: 'quizQuestion1',
      nextScreen: 'quizQuestion2',
      questionText: 'Hvad er svaret på spørgsmål 1?'
    }),
    ...questionSectionData({
      id: 'quizQuestion2',
      nextScreen: 'quizDone',
      questionText: 'Hvad er svaret på spørgsmål 2?'
    }),
    quizDone: {
      _id: 'quizDone',
      nextSection: 'quizIntro',
      dispatch: [
        dispatchActionData({
          score: 1,
          screen: 'won',
          trophyImage: 'http://...'
        }),
        dispatchActionData({score: -1, screen: 'retry', trophyImage: ''})
      ]
    },
    won: infoScreenData({
      _id: 'won',
      parent: 'quizDone',
      text: 'Tillykke, du havde {{correct}} ud af {{questionCount}} rigtige',
      action: {screen: 'quizIntro'},
      buttonText: 'Prøv igen'
    }),
    retry: infoScreenData({
      _id: 'retry',
      parent: 'quizDone',
      text: 'Prøv igen...',
      action: {screen: 'quizIntro'},
      buttonText: 'Prøv igen'
    })
  }
});
