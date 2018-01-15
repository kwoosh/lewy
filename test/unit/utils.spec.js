import utils from '../../src/utils'

describe('Utils', () => {
    describe('intercept', () => {
        const data = { lol: 'kek' }
        const interceptor = (obj) => obj.lol
    
        test('should handle passed object', () => {
            expect(utils.intercept(data, interceptor)).toBe('kek')
        })
    
        test('should return headled by default object', () => {
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

        test('should reject on timeout', () => {
            expect.assertions(1)
            return expect(utils.startTimeout(promise, 1000, errMessage))
                .rejects
                .toMatch(errMessage)
        })

        test('should resolve if time left', () => {
            expect.assertions(1)
            return expect(utils.startTimeout(promise, 5000, errMessage))
                .resolves
                .toBe('done')
        })
    })

    describe('checkStats', () => {
        test('should resolve if status between 200 and 300', () => {
            const niceRes = { status: 200, statusText: 'Ok' }

            expect.assertions(1)
            return expect(utils.checkStatus(niceRes))
                .resolves
                .toEqual(niceRes)
        })

        test('sould reject if status is ivalid', () => {
            const badRes = { status: 404, statusText: 'Not found' }
            const err = new Error(badRes.statusText)

            expect.assertions(1)
            return expect(utils.checkStatus(badRes))
                .rejects
                .toEqual(err)
        })
    })

    describe('serializer', () => {
        const params = { lol: 'kek' }
        const paramSerializer = (params) => 'lol=kek'
    
        test('should handle params by callback', () => {
            expect(utils.serializer(params, paramSerializer)).toBe('lol=kek')
        })
    
        test('should return stringified params', () => {
            expect(utils.serializer(params)).toBe(JSON.stringify(params))
        })
    })

    describe('cunstructURL', () => {
        test('should concat baseURL, relativeURL and params(if exist) to single string', () => {
            const baseURL = 'https://test.some'
            const relativeURL = '/api/post/1'
            const params = 'some=10'
        
            const url = utils.constructURL(baseURL, relativeURL)
            const urlWithParams = utils.constructURL(baseURL, relativeURL, params)
        
            expect(url).toBe('https://test.some/api/post/1')
            expect(urlWithParams).toBe('https://test.some/api/post/1?some=10')
        })
    })

    describe('hasBody', () => {
        test('should check if request method could have a body', () => {
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
})