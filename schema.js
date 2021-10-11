const mongoose = require('mongoose'), Schema = mongoose.Schema
const { nameGenerator, doBGenerator } = require('./Students')
const durationDate = require('./DurationDate')

async function defineCourse() {

    await mongoose.connect('mongodb://localhost:27017/bootcamp');

    // -------------------------create a new schema for our course-----------------------------------------------------
    const courseSchema = new Schema({
        course_name: String,
        curriculum: String,
        duration_weeks: Number
    })

    // -------------------------create a new schema for our student-----------------------------------------------------
    const studentSchema = new Schema({
        first_name: String,
        last_name: String,
        dob: Date,
        cohort: { type: Schema.Types.Number, ref: "Cohort" } // ref the course_name of the course object
    })

    // -------------------------create a new schema for our cohort-----------------------------------------------------
    const cohortSchema = new Schema({
        cohort: Number,
        course: { type: Schema.Types.String, ref: "Course" }, // ref the course_name of the course object
        duration: { type: Schema.Types.Number, ref: "Course" },
        startDate: Date,
        endDate: Date // Take course duration and add to startDate method
    })

    // -------------------------create models-------------------------------------------------------------------------
    // creating just a schema will do nothing so...behold below...
    const Student = mongoose.model("Student", studentSchema) // Naming is case sensitive! This will create a student collection that uses student schema. 
    const Cohort = mongoose.model("Cohort", cohortSchema)
    const Course = mongoose.model("Course", courseSchema)

    // -------------------------create new objects using schema ------------------------------------------------------
    // Create course
    const createCourse = new Course({
        course_name: "Back end Java Script",
        curriculum: "Software Engineering",
        duration_weeks: 6
    })

   
    // Create cohort
    const createCohort = new Cohort({
        cohort: 2,
        course_name: createCourse._id,//createCourse.course_name, // ref the course_name of the course object
        duration_weeks: createCourse.duration_weeks,//createCourse.duration_weeks,
        startDate: new Date('2022-03-01'), // Cohort 1 starts 1/1/2022, 2 starts 1/3/2022
        endDate: new Date(durationDate(new Date('2022-03-01'), createCourse.duration_weeks))//new Date(durationDate(startDate, duration)) // Take course duration and add to startDate method
    })

    // Create student
    const createStudent = new Student({
        first_name: nameGenerator(),
        last_name: nameGenerator(),
        dob: doBGenerator(),
        cohort: createCohort.cohort
    })


    // The above is all well and good but we need to save our data...
    await createCourse.save()
    await createCohort.save()
    await createStudent.save()
    console.log(createCourse)
    console.log(createCohort)
    console.log(createStudent)
}
defineCourse()

