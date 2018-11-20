export const testQuiz1 = {
  start: 'intro',
  screens: {
    done: {
      _id: 'done',
      nextSection: 'intro',
      dispatch: [
        {
          condition: {atLeast: {score: 5}},
          action: {
            screen: '57b4bccd-1bfe-471b-87e4-6bb6a642fd66',
            set: {trophy: {image: ''}},
            callback: true
          }
        },
        {
          condition: {atLeast: {score: 2}},
          action: {
            screen: 'd485421a-b9c4-43f6-a52e-bc1984381e66',
            set: {
              trophy: {
                image: 'openplatform:f6257503-2fed-44cb-aa13-c628012d64b6'
              }
            },
            callback: true
          }
        },
        {
          condition: {atLeast: {score: -1}},
          action: {screen: 'retry', set: {trophy: {image: ''}}, callback: true}
        }
      ]
    },
    question2answer1: {
      _id: 'question2answer1',
      parent: 'question2',
      ui: [
        {type: 'media', url: ''},
        {
          type: 'text',
          text: '# Forkert/Rigtigt svar\n\nDet rigtige svar er ... fordi...'
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b'}
        }
      ],
      log: true
    },
    question1answer1: {
      _id: 'question1answer1',
      parent: 'question1',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'nej, nej, nej...'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    question2answer2: {
      _id: 'question2answer2',
      parent: 'question2',
      ui: [
        {type: 'media', url: ''},
        {
          type: 'text',
          text: '# Rigtigt/Forkert svar\n\nDet var rigtigt fordi...'
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b'}
        }
      ],
      log: true
    },
    retry: {
      _id: 'won',
      parent: 'done',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Prøv igen...'},
        {
          type: 'button',
          color: 'primary',
          text: 'Prøv igen',
          action: {screen: 'intro'}
        }
      ],
      log: true
    },
    '51a0b0ee-da7e-4c0f-baf6-58dcfb5feed9': {
      _id: '51a0b0ee-da7e-4c0f-baf6-58dcfb5feed9',
      parent: 'question1',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Forklaring af resultatet'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    question1answer2: {
      _id: 'question1answer2',
      parent: 'question1',
      ui: [
        {type: 'media', url: ''},
        {
          type: 'text',
          text: 'Det var rigtigt... men kunne være meget bedre...'
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
    question1: {
      _id: 'question1',
      nextSection: 'question2',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Hvad er svaret'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              color: 'primary',
              text: 'Svar A',
              action: {
                screen: 'question1answer1',
                increment: {score: 0, correct: 0, questionCount: 1}
              },
              image: ''
            },
            {
              type: 'button',
              color: 'primary',
              text: 'Svar B',
              action: {
                screen: 'question1answer2',
                increment: {score: 1, correct: 1, questionCount: 1}
              }
            },
            {
              type: 'button',
              color: 'primary',
              text: 'Svar C',
              action: {
                screen: '9a2dee89-e8f9-4fe9-9385-61fb715cb2ba',
                increment: {score: 4, correct: 1, questionCount: 1}
              },
              image: 'openplatform:a6c4aa8f-8f42-4d97-a184-933c899885ab'
            },
            {
              type: 'button',
              color: 'primary',
              text: '',
              action: {
                screen: 'bca402ee-13bd-426c-95f4-809cc070ae2a',
                increment: {score: 0, correct: 0, questionCount: 1}
              }
            },
            {
              type: 'button',
              color: 'primary',
              text: '',
              action: {
                screen: '51a0b0ee-da7e-4c0f-baf6-58dcfb5feed9',
                increment: {score: 1, correct: 1, questionCount: 1}
              },
              image: 'openplatform:d228c861-6d6c-4629-afa4-49b01bb04a52'
            }
          ]
        },
        {type: 'spacing'},
        {
          type: 'button',
          color: 'secondary',
          text: 'hjælp',
          action: {screen: 'question1help'}
        }
      ]
    },
    question2: {
      _id: 'question2',
      nextSection: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Hvad er svaret på spørgsmål 2?'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              color: 'primary',
              text: 'Svar A',
              action: {
                screen: 'question2answer1',
                increment: {score: 0, correct: 0, questionCount: 1}
              }
            },
            {
              type: 'button',
              color: 'primary',
              text: 'Svar B',
              action: {
                screen: 'question2answer2',
                increment: {score: 1, correct: 1, questionCount: 1}
              }
            }
          ]
        },
        {type: 'spacing'},
        {
          type: 'button',
          color: 'secondary',
          text: 'hjælp',
          action: {screen: 'question2help'}
        }
      ]
    },
    intro: {
      start: true,
      nextSection: 'question1',
      _id: 'intro',
      ui: [
        {
          type: 'media',
          url: 'openplatform:3ac3d6ce-3c19-427c-88b3-ce11931186e1'
        },
        {type: 'text', text: '# Velkommen til quizzen\n\nUd i det blå'},
        {
          type: 'button',
          color: 'primary',
          text: 'Start',
          action: {
            screen: 'question1',
            set: {score: 0, correct: 0, questionCount: 0}
          }
        }
      ],
      log: true
    },
    question1help: {
      _id: 'question1help',
      parent: 'question1',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Der er ikke mere ~mælk~ hjælp'},
        {
          type: 'button',
          color: 'primary',
          text: 'Tilbage',
          action: {screen: 'question1'}
        }
      ],
      log: true
    },
    question2help: {
      _id: 'question2help',
      parent: 'question2',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Her er et hint...'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    'bca402ee-13bd-426c-95f4-809cc070ae2a': {
      _id: 'bca402ee-13bd-426c-95f4-809cc070ae2a',
      parent: 'question1',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Forklaring af resultatet'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    '9a2dee89-e8f9-4fe9-9385-61fb715cb2ba': {
      _id: '9a2dee89-e8f9-4fe9-9385-61fb715cb2ba',
      parent: 'question1',
      ui: [
        {
          type: 'media',
          url: 'openplatform:a6c4aa8f-8f42-4d97-a184-933c899885ab'
        },
        {type: 'text', text: ''},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'question2'}
        }
      ],
      log: true
    },
    '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b': {
      _id: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b',
      nextSection: 'done',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Spørgsmål?'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              color: 'primary',
              text: 'Svar A',
              action: {
                screen: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04banswer1',
                increment: {score: 0, correct: 0, questionCount: 1}
              }
            },
            {
              type: 'button',
              color: 'primary',
              text: 'Svar B',
              action: {
                screen: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04banswer2',
                increment: {score: 1, correct: 1, questionCount: 1}
              }
            }
          ]
        },
        {type: 'spacing'},
        {
          type: 'button',
          color: 'secondary',
          text: 'hjælp',
          action: {screen: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04bhelp'}
        }
      ]
    },
    won: {
      _id: 'won',
      parent: 'done',
      ui: [
        {type: 'media', url: ''},
        {
          type: 'text',
          text:
            'Tillykke, du havde {{correct}} ud af {{questionCount}} rigtige\n\nhttps://google.com'
        },
        {
          type: 'button',
          color: 'primary',
          text: 'Prøv igen',
          action: {screen: 'intro'}
        }
      ],
      log: true
    },
    '82e6df55-a1f8-4cd6-9ced-4ad8a997b04bhelp': {
      _id: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04bhelp',
      parent: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b',
      ui: [
        {type: 'media', url: ''},
        {type: 'text', text: 'Her er et hint...'},
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b'}
        }
      ],
      log: true
    },
    'd485421a-b9c4-43f6-a52e-bc1984381e66': {
      _id: 'd485421a-b9c4-43f6-a52e-bc1984381e66',
      parent: 'done',
      ui: [
        {type: 'media', url: 'https://www.youtube.com/watch?v=JkMwq1aAAfE'},
        {
          type: 'text',
          text:
            'Tillykke, du havde {{correct}} ud af {{questionCount}} rigtige. Total: {{score}}'
        },
        {
          type: 'button',
          color: 'primary',
          text: 'Prøv igen',
          action: {screen: 'intro'}
        }
      ],
      log: true
    },
    '57b4bccd-1bfe-471b-87e4-6bb6a642fd66': {
      _id: '57b4bccd-1bfe-471b-87e4-6bb6a642fd66',
      parent: 'done',
      ui: [
        {type: 'media', url: 'https://vimeo.com/218885093'},
        {
          type: 'text',
          text:
            'Tillykke, du havde {{correct}} ud af {{questionCount}} rigtige, yeah... fejl: {{ hello'
        },
        {type: 'button', color: 'primary', text: '', action: {screen: 'intro'}}
      ],
      log: true
    },
    '82e6df55-a1f8-4cd6-9ced-4ad8a997b04banswer1': {
      _id: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04banswer1',
      parent: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b',
      ui: [
        {type: 'media', url: ''},
        {
          type: 'text',
          text: '# Forkert/Rigtigt svar\n\nDet rigtige svar er ... fordi...'
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
    '82e6df55-a1f8-4cd6-9ced-4ad8a997b04banswer2': {
      _id: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04banswer2',
      parent: '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b',
      ui: [
        {type: 'media', url: ''},
        {
          type: 'text',
          text: '# Rigtigt/Forkert svar\n\nDet var rigtigt fordi...'
        },
        {
          type: 'button',
          color: 'primary',
          text: 'videre',
          action: {screen: 'done'}
        }
      ],
      log: true
    }
  },
  backgroundImage: 'openplatform:ce096071-b6ab-4a0d-8b81-93cfa8ee0a40',
  style: {
    primaryColor: '#0b6f9f',
    secondaryColor: '#768e87',
    backgroundColor: '{"r":196,"g":200,"b":206,"a":0.7}'
  },
  title: 'Quiz test eksempel',
  tags: ['nøgleord1', 'nøgleord2'],
  description: 'Beskrivelse af den nye quiz',
  _owner: 'quiz-demo',
  _type: '253105bc-abe4-4aee-830e-387035eeb2e0',
  _id: '78087084-efa1-44ac-b6cf-83d7b5d8c255',
  _version: '2018-11-20T11:46:41.458Z',
  _client: '930df375-74f3-4f6a-8695-9919e6fc5096'
};
