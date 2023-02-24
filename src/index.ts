const printLine = (text: string,breakLine: boolean=true)=>{
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

const promptInput = async ( text: string)=>{
    printLine(`\n${text}\n`,false)
    const input: string = await new Promise((resolve) => process.stdin.once('data',(data) => resolve(data.toString())))
    return input.trim()
}

class HitAndBlow{
    private readonly answerSource = ['0','1','2','3','4','5','6','7','8','9']
    private answer : string[] = []
    private tryCount  = 0
    private mode : 'normal' | 'hard' | 'honi'

    constructor(mode: 'normal' | 'hard'){
        this.mode = mode
    }

    private getAnswerLength() {
        switch(this.mode){
            case 'normal':
                return 3
            case 'hard':
                return 4 
            case 'honi':
                return 5
            default:
                const neverValue : never = this.mode
                throw new Error(`${this.mode}は無効なモードです`)
        }
    }

    setting(){
        const answerLength = this.getAnswerLength()

        while (this.answer.length < answerLength){
            const randNum = Math.floor(Math.random() * this.answerSource.length)
            const selectedItem = this.answerSource[randNum]
            if(!this.answer.includes(selectedItem)){
                this.answer.push(selectedItem)
            }
        }
    }

    async play(){
        const answerLength = this.getAnswerLength()
        const inputArr = (await promptInput(`「,」区切りで${answerLength}つの数字を入力してください`)).split(',')

        if (!this.validate(inputArr)){
            printLine('無効な入力です')
            await this.play()
            return
        }
        const result = this.check(inputArr)

        if (result.hit !== this.answer.length){
            //不正解
            printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n`)
            this.tryCount += 1
            await this.play()
        } else {
            //正解
            this.tryCount += 1
        }
    }

    private check(input: string[]){
        let hitCount = 0
        let blowCount = 0
        input.forEach((val,index) =>{
            if (val == this.answer[index]){
                hitCount += 1
            } else if (this.answer.includes(val)){
                blowCount += 1
            }
        })

        return {
            hit : hitCount,
            blow : blowCount,
        }
    }

    end(){
        printLine(`正解でござる \n試行回数: ${this.tryCount}回`)
        process.exit()
    }

    private validate(inputArr: string[]){
        const isLengthValid = inputArr.length == this.answer.length
        const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
        const isAllDifferentValues = inputArr.every((val,i) => inputArr.indexOf(val) === i)
        return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues
    }

}

;(async() => {
    // const name = await promptInput('名前を入れてください')
    // console.log(name)
    // const age = await promptInput('年齢を入力してください')
    // console.log(age)
    // process.exit()
    const hitAndBlow = new HitAndBlow('hard')
    hitAndBlow.setting()
    await hitAndBlow.play()
    hitAndBlow.end()
})()