import utils from '../../src/utils'

describe('Utils', () => {
    describe.skip('intercept', () => {
        const data = { lol: 'kek' }
        const interceptor = (obj) => obj.lol

        it('should handle passed object', () => {
            expect(utils.intercept(data, interceptor)).toBe('kek')
        })

        it('should return headled by default object', () => {
            expect(utils.intercept(data)).toBe(data)
        })
    })

    describe('startTimeout', () => {
        const errMessage = 'Time is out'
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('done')
            }, 3000)
        })

        it('should reject on timeout', () => {
            expect.assertions(1)
            return expect(utils.startTimeout(promise, 1000, errMessage))
                .rejects
                .toMatch(errMessage)
        })

        it('should resolve if time left', () => {
            expect.assertions(1)
            return expect(utils.startTimeout(promise, 5000, errMessage))
                .resolves
                .toBe('done')
        })
    })

    describe('handleStatus', () => {
        it('should resolve if status between 200 and 300', () => {
            const niceRes = { status: 200, statusText: 'Ok' }

            expect.assertions(1)
            return expect(utils.handleStatus(niceRes))
                .resolves
                .toEqual(niceRes)
        })

        it('sould reject if status is ivalid', () => {
            const badRes = { status: 404, statusText: 'Not found' }
            const err = new Error(badRes.statusText)

            expect.assertions(1)
            return expect(utils.handleStatus(badRes))
                .rejects
                .toEqual(err)
        })
    })

    describe('paramsSerializer', () => {
        const params = { lol: 'kek' }
        const serializer = (params) => 'lol=kek'

        it('should handle params by callback', () => {
            expect(utils.paramsSerializer(params, serializer)).toBe('lol=kek')
        })

        it('should return stringified params', () => {
            expect(utils.paramsSerializer(params)).toBe(JSON.stringify(params))
        })
    })

    describe('cunstructURL', () => {
        it('should concat baseURL, relativeURL and params(if exist) to single string', () => {
            const baseURL = 'https://it.some'
            const relativeURL = '/api/post/1'
            const params = 'some=10'

            const url = utils.constructURL(baseURL, relativeURL)
            const urlWithParams = utils.constructURL(baseURL, relativeURL, params)

            expect(url).toBe('https://it.some/api/post/1')
            expect(urlWithParams).toBe('https://it.some/api/post/1?some=10')
        })

        it('should ignore baseURL if relativeURL is fully', () => {
            const baseURL = 'https://it.some'
            const relativeURL = 'http://some.other/api'

            expect(utils.constructURL(baseURL, relativeURL)).toBe(relativeURL)
        })
    })

    describe('hasBody', () => {
        it('should check if request method could have a body', () => {
            const POST = 'POST'
            const PUT = 'PUT'
            const PATCH = 'PATCH'
            const otherMethod = 'SOMEOTHER'

            expect(utils.hasBody(POST)).toBeTruthy()
            expect(utils.hasBody(PUT)).toBeTruthy()
            expect(utils.hasBody(PATCH)).toBeTruthy()
            expect(utils.hasBody(otherMethod)).toBeFalsy()
        })
    })

    describe('getWritbleOptions', () => {
        it('sould return writble object', () => {
            const object = {
                kek: 'lol',
                got () {}
            }

            expect(utils.getWritbleOptions(object)).toEqual({ kek: 'lol' })
        })
    })
})