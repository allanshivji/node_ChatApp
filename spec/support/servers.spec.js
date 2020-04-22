var request = require('request');

describe ('calc', () => {
    it('should multiply 2 and 2', () =>{
        expect(2*2).toBe(4);
    })
});

describe('get Messages', () => {
    it('should return status 200 ok', () => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })

    it('should return non-empty list', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body.length)).toBeGreaterThan(0)
            done()
        })
    })
})


// Test first Development
describe('get messages from user', () => {
    it('should return status 200 ok', (done) => {
        request.get('http://localhost:3000/messages/tim', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it('name should be tim', (done) => {
        request.get('http://localhost:3000/messages/Allan', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('Allan')
            done()
        })
    })
})
