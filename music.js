class Music{
    constructor(title,singer,img,file){
        this.title = title;
        this.singer = singer;
        this.img = img;
        this.file = file;
    }

    getName(){
        return this.title + " - " + this.singer;
    }
}

const musicList = [
    new Music("Pastoy Paravoz","Styeet Ayt","1.jpg","1.mp3"),
    new Music("Bana Aşk Ver","Aynur Aydır","2.jpg","2.mp3")
];