import { useHistory, useParams } from 'react-router-dom'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    // const { user } = useAuth()
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id

    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/')
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true
        })
    }

    async function handleDeleteQuestin(questionId: string) {
        if (window.confirm('Tem certeza que deseja deletar essa pergunta')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo letmeask" />
                    <div >
                        <RoomCode code={roomId} />
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                author={question.author}
                                content={question.content}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestin(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}