import speech_recognition as sr


def recognition():
    r = sr.Recognizer()

    with sr.Microphone() as source:
        print("I am listening...")
        audio = r.listen(source)

    try:
        data = r.recognize_google(audio)
        print("You said: " + data)
        return data.lower()

    except sr.UnknownValueError:
        print("Google Speech Recognition did not understand audio")
        return "ERROR"

    except sr.RequestError as e:
        print("Request Failed; {0}".format(e))
        return "ERROR"