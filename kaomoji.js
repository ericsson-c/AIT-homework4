// kaomoji
class Kaomoji {
    constructor(value, [...emotions]) {
        this.value = value;
        this.emotions = emotions.map(e => e.toLowerCase());
    }

    isEmotion(emotion) {
        if (this.emotions.includes(emotion.toLowerCase())) {
            return true;
        } else {
            return false;
        }
    }
} // end class

module.exports = {
    "Kaomoji": Kaomoji
};