const sampleQuiz = {
  _type: 'quiz',
  _id: 'quizId',
  description: {
    title: 'Sample Quiz',
    tags: ['foo', 'bar'],
    styling: {
      background: {},
      '...': '...'
    },
    start: 'intro',
    initialState: {
      score: 0,
      maxScore: 0
    }
  },
  screens: {
    intro: {
      ui: [
        {type: 'image', image: 'https://www.dbc.dk/logo.png'},
        {
          type: 'text',
          text: `
        Introtekst om quizzen, ...

        Her er mere beskrivelse
        `
        },
        {
          type: 'button',
          text: 'Start',
          action: {
            screen: 'question1'
          }
        }
      ],
      log: true
    },
    question1: {
      ui: [
        {
          type: 'image',
          image:
            'https://opensource.dbc.dk/sites/all/themes/opensource/logo.png'
        },
        {type: 'text', text: 'Spørgsmål 1?'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              text: 'wrong answer A',
              action: {
                screen: 'answer1a',
                increment: {
                  score: 0,
                  maxScore: 1
                }
              }
            },
            {
              type: 'button',
              text: 'correct answer B',
              action: {
                screen: 'answer1b',
                increment: {
                  score: 1,
                  maxScore: 1
                }
              }
            }
          ]
        },
        {
          type: 'button',
          text: 'hjælp',
          action: {screen: 'help1'}
        }
      ]
    },
    help1: {
      ui: [
        {type: 'text', text: 'her er et hint: A'},
        {
          type: 'button',
          text: 'videre',
          action: {screen: 'question1'}
        }
      ]
    },
    answer1a: {
      ui: [
        {
          type: 'text',
          text: `FORKERT SVAR. 

      Det rigtige svar er fordi...`
        },
        {type: 'button', text: 'videre', action: 'question2'}
      ],
      log: true
    },
    answer1b: {
      ui: [
        {
          type: 'text',
          text: `Rigtigt svar...

      Det var rigtigt...`
        },
        {type: 'button', text: 'videre', action: 'question2'}
      ],
      log: true
    },
    question2: {
      ui: [
        {type: 'image', image: 'https://www.dbc.dk/logo.png'},
        {type: 'text', text: 'Spørgsmål 2?'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              text: 'wrong answer A',
              action: {
                screen: 'answer2a',
                increment: {
                  score: 0,
                  maxScore: 1
                }
              }
            },
            {
              type: 'button',
              text: 'correct answer B',
              action: {
                screen: 'answer2b',
                increment: {
                  score: 1,
                  maxScore: 1
                }
              }
            }
          ]
        },
        {
          type: 'button',
          text: 'hjælp',
          action: {screen: 'help2'}
        }
      ]
    },
    help2: {
      ui: [
        {type: 'text', text: 'her er et hint: A'},
        {
          type: 'button',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ]
    },
    answer2a: {
      ui: [
        {
          type: 'text',
          text: `FORKERT SVAR. 

      Det rigtige svar er fordi...`
        },
        {type: 'button', text: 'videre', action: 'done'}
      ],
      log: true
    },
    answer2b: {
      ui: [
        {
          type: 'text',
          text: `Rigtigt svar...

      Det var rigtigt...`
        },
        {type: 'button', text: 'videre', action: 'done'}
      ],
      log: true
    },
    done: {
      dispatch: [
        {
          condition: {atLeast: {score: 1}},
          action: {
            screen: 'won',
            set: {trophy: {image: 'http://...'}},
            callback: true
          }
        },
        {action: {screen: 'retry'}}
      ]
    },
    won: {
      ui: [
        {
          type: 'image',
          image:
            'https://opensource.dbc.dk/sites/all/themes/opensource/logo.png'
        },
        {
          type: 'text',
          text: 'Tillykke, du havde {{score}} ud af {{scoreMax}} rigtige'
        }
      ],
      log: true
    },
    retry: {
      ui: [
        {type: 'text', text: 'prøv igen'},
        {
          type: 'button',
          text: 'videre',
          action: {screen: 'intro'}
        }
      ],
      log: true
    }
  }
};

export default sampleQuiz;
