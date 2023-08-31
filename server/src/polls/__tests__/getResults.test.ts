import { Suggestions, Rankings } from 'shared/poll-types'
import getResults from '../getResults'

describe('getResults', () => {
    it('computes and sorts the results', () => {
        const suggestions: Suggestions = {
            '1': {
                voterID: '1',
                text: 'suggestion 1'
            },
            '2': {
                voterID: '2',
                text: 'suggestion 2'
            },
            '3': {
                voterID: '3',
                text: 'suggestion 3'
            },
            '4': {
                voterID: '4',
                text: 'suggestion 4'
            }
        }

        const rankings: Rankings = {
            voter1: ['2', '1', '3'],
            voter2: ['4', '1', '2'],
            voter3: ['3', '2', '1'],
            voter4: ['2', '4', '1']
        }

        const results = getResults(rankings, suggestions, 3)

        expect(results[0].suggestionID).toBe('2')
        expect(results[0].text).toBe('suggestion 2')
        expect(results[0].score).toBe(9)

        expect(results[1].suggestionID).toBe('1')
        expect(results[1].text).toBe('suggestion 1')
        expect(results[1].score).toBe(6)

        expect(results[2].suggestionID).toBe('4')
        expect(results[2].text).toBe('suggestion 4')
        expect(results[2].score).toBe(5)

        expect(results[3].suggestionID).toBe('3')
        expect(results[3].text).toBe('suggestion 3')
        expect(results[3].score).toBe(4)
    })
})