export const dispatchScreenData = ({_id, parent, action, text}) => ({
  _id,
  parent,
  ui: [
    {
      type: 'media',
      url: ''
    },
    {
      type: 'text',
      text:
        text || 'Tillykke, du havde {{correct}} ud af {{questionCount}} rigtige'
    },
    {
      type: 'button',
      color: 'primary',
      text: 'Prøv igen',
      action
    }
  ],
  log: true
});

export const dispatchActionData = ({score, screen, trophyImage}) => ({
  condition: {atLeast: {score: score || 0}},
  action: {
    screen,
    set: {trophy: {image: trophyImage || ''}},
    callback: true
  }
});

export const answerScreenData = ({_id, parent, action}) => ({
  _id,
  parent,
  ui: [
    {
      type: 'media',
      url: ''
    },
    {
      type: 'text',
      text: 'Forklaring af resultatet'
    },
    {
      type: 'button',
      color: 'primary',
      text: 'videre',
      action
    }
  ],
  log: true
});

export const answerButtonData = ({nextScreen}) => ({
  type: 'button',
  color: 'primary',
  text: 'Tekst på svarknap',
  action: {
    screen: nextScreen,
    increment: {score: 0, correct: 0, questionCount: 1}
  }
});

export const quizData = () => ({
  _type: 'quiz',
  _id: 'quizId',
  title: 'Sample Quiz',
  description: 'some description',
  tags: ['foo', 'bar'],
  trophyImage: 'https://www.dbc.dk/logo.png',
  style: {
    primaryColor: '#0b6f9f',
    secondaryColor: '#768e87'
  },
  start: 'intro',
  screens: {
    intro: {
      _id: 'intro',
      start: true,
      nextSection: 'question1',
      ui: [
        {type: 'media', url: 'https://www.dbc.dk/logo.png'},
        {
          type: 'text',
          text: `
                  Introtekst om quizzen, ...
                  
                          Her er mere beskrivelse
                                  `
        },
        {
          type: 'button',
          color: 'primary',
          text: 'Start',
          action: {
            screen: 'question1',
            set: {
              score: 0,
              correct: 0,
              questionCount: 0
            }
          }
        }
      ],
      log: true
    },
    question1: {
      _id: 'question1',
      nextSection: 'question2',
      ui: [
        {
          type: 'media',
          url: 'https://opensource.dbc.dk/sites/all/themes/opensource/logo.png'
        },
        {type: 'text', text: 'Spørgsmål 1?'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              text: 'wrong answer A',
              color: 'primary',
              action: {
                screen: 'answer1a',
                increment: {
                  score: 0,
                  correct: 0,
                  questionCount: 1
                }
              }
            },
            {
              type: 'button',
              text: 'correct answer B',
              color: 'primary',
              action: {
                screen: 'answer1b',
                increment: {
                  score: 1,
                  correct: 1,
                  questionCount: 1
                }
              }
            }
          ]
        },
        {type: 'spacing'},
        {
          type: 'button',
          color: 'secondary',
          text: 'hjælp',
          action: {screen: 'help1'}
        }
      ]
    },
    help1: {
      _id: 'help1',
      parent: 'question1',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'her er et hint: A'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question1'}
        }
      ]
    },
    answer1a: {
      _id: 'answer1a',
      parent: 'question1',
      ui: [
        {
          type: 'text',
          text: `FORKERT SVAR. 
          
                    Det rigtige svar er fordi...`
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    answer1b: {
      _id: 'answer1b',
      parent: 'question1',
      ui: [
        {
          type: 'text',
          text: `Rigtigt svar...
          
                Det var rigtigt...`
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    question2: {
      _id: 'question2',
      nextSection: 'done',
      ui: [
        {type: 'media', url: 'https://www.dbc.dk/logo.png'},
        {type: 'text', text: 'Spørgsmål 2?'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              color: 'primary',
              text: 'wrong answer A',
              action: {
                screen: 'answer2a',
                increment: {
                  score: 0,
                  correct: 0,
                  questionCount: 1
                }
              }
            },
            {
              type: 'button',
              color: 'primary',
              text: 'correct answer B',
              action: {
                screen: 'answer2b',
                increment: {
                  score: 1,
                  correct: 1,
                  questionCount: 1
                }
              }
            }
          ]
        },
        {type: 'spacing'},
        {
          type: 'button',
          color: 'secondary',
          text: 'hjælp',
          action: {screen: 'help2'}
        }
      ]
    },
    help2: {
      _id: 'help2',
      parent: 'question2',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'her er et hint: A'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ]
    },
    answer2a: {
      _id: 'answer2a',
      parent: 'question2',
      ui: [
        {
          type: 'text',
          text: `FORKERT SVAR. 
          
                Det rigtige svar er fordi...`
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'done'}
        }
      ],
      log: true
    },
    answer2b: {
      _id: 'answer2b',
      parent: 'question2',
      ui: [
        {
          type: 'text',
          text: `Rigtigt svar...
          
                    Det var rigtigt...`
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'done'}
        }
      ],
      log: true
    },
    done: {
      _id: 'done',
      nextSection: 'intro',
      dispatch: [
        dispatchActionData({
          score: 1,
          screen: 'won',
          trophyImage: 'http://...'
        }),
        dispatchActionData({score: -100, screen: 'retry', trophyImage: ''})
      ]
    },
    won: dispatchScreenData({
      _id: 'won',
      parent: 'done',
      action: {screen: 'intro'}
    }),
    retry: dispatchScreenData({
      _id: 'retry',
      parent: 'done',
      action: {screen: 'intro'},
      text: 'Prøv igen'
    })
  }
});

export const questionSectionData = ({
  before,
  questionId,
  helpId,
  answerId,
  nextId
}) => ({
  [questionId]: {
    _id: questionId,
    nextSection: nextId,
    ui: [
      {
        type: 'media',
        url: ''
      },
      {type: 'text', text: 'Nyt spørgsmål...'},
      {
        type: 'buttonGroup',
        ui: [
          {
            type: 'button',
            color: 'primary',
            text: 'Svar',
            action: {
              screen: answerId,
              increment: {
                score: 1,
                maxScore: 1
              }
            }
          }
        ]
      },
      {type: 'spacing'},
      {
        type: 'button',
        text: 'hjælp',
        color: 'secondary',
        action: {screen: helpId}
      }
    ]
  },
  [helpId]: {
    _id: helpId,
    parent: questionId,
    ui: [
      {
        type: 'media',
        url: ''
      },
      {type: 'text', text: 'Hint til spørgsmål'},
      {
        type: 'button',
        text: 'Tilbage til spørgsmålet',
        action: {screen: questionId}
      }
    ]
  },
  [answerId]: {
    _id: answerId,
    parent: questionId,
    ui: [
      {
        type: 'text',
        text: 'Feedback på besvarelsen'
      },
      {type: 'button', text: 'Fortsæt', action: {screen: nextId}}
    ],
    log: true
  }
});
