const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Mantas';
    var text = 'text';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
      var from = 'Mantas';
      var latitude = 1;
      var longitude = 1;
      var url = `https://www.google.com/maps?q=${latitude},${longitude}`
      var message = generateLocationMessage(from, latitude, longitude);

      expect(message.createdAt).toBeA('number');
      expect(message.from).toBe(from);
      expect(message.url).toBe(url);
  });
});
