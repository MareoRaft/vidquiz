"use strict"

///////////// bootleg set behaviors on arrays :( ///////////////////
function setContained(arr1, arr2){
	for( let i in arr1 ){
		if( !_.contains(arr2, arr1[i]) ) return false
	}
	return true
}
function setEqual(arr1, arr2) {
	return setContained(arr1, arr2) && setContained(arr2, arr1)
}
// end set behaviors on arrays


class Quiz {
	constructor(obj) {
		$.extend(true, this, obj)
		this.$video = $("#"+this.video_id)
		this.video = this.$video.get(0)
		this.activate()
	}
	activate() {
		// this method really shouldn't run twice
		let quiz = this
		let lastTime = 0
		let currentQuestion = undefined
		// create jquery listener that checks video time against Question.time
		this.$video.on('timeupdate', function(){
			let thisTime = this.currentTime
			for( let q in quiz.questions ){
				let question = quiz.questions[q]
				// additionally, we should check that the difference between lastTime and thisTime is small.  If somebody clicks to jump way ahead in the video, we won't want all the questions popping up!
				if( lastTime < question.time && question.time <= thisTime && (thisTime - lastTime) < 1.5 ){
					quiz.ask(question)
					currentQuestion = question
				}
			}
			lastTime = thisTime
		})
		this.$video.on('playing', function(){ if( currentQuestion !== undefined ) quiz.submit(currentQuestion) })
		$('button').click(function(){ quiz.video.play() })
	}
	ask(question) {
		this.video.pause()
		for( let i in question.positions ){
			let $el = $('<input class="wrapper" name="connectedradios">')
			$el.attr('type', question.type)
			$el.attr('value', i)
			$el.css('left', question.positions[i][0] * this.video.width)
			$el.css('top', question.positions[i][1] * this.video.height)
			$('#container').append($el)
		}
		$('#correctness').css('visibility', 'hidden')
		$('button').css('visibility', 'visible')
	}
	submit(question) {
		let correct = false
		if( question.type === 'radio' ){
			let radio_value = $('input[type=radio]:checked').val()
			if( radio_value == question.correct_value ) correct = true // fuzzy equals ON PURPOSE
		}
		else if( question.type === 'checkbox' ){
			let checkbox_values = []
			$('input[type=checkbox]:checked').each(function(){
				checkbox_values.push(parseInt(this.value)) // we want actual integer, NOT a string
			})
			if( setEqual(checkbox_values, question.correct_value) ) correct = true
		}
		// now that we've determined correctness, remove the elements.  ORDER MATTERS
		$('.wrapper').remove()
		$('button').css('visibility', 'hidden')
		// if their answer is correct, display "correct". otherwise, "incorrect"
		let content = ( correct )? 'Correct!': 'Incorrect.'
		$('#correctness').html(content)
		$('#correctness').css('visibility', 'visible')
		// play vid
		this.video.play()
	}
}

class Question {
	constructor(obj) {
		_.defaults(obj, {
			type: "radio",
		})
		$.extend(true, this, obj)
	}
}
