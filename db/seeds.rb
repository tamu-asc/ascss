# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
users = User.create([
                        {username: "utkarshc", role: "user", email: "utkarshc@tamu.edu", password: "utkarsh"},
                        {username: "utkarsh", role: "user", email: "utkarshc@gmail.com", password: "utkarsh"}])

courses = Course.create([{title: "Software", semester: "spring", year: 2019, credits: 3, code: "CSE606"}])

course_students = CourseStudent.create([{username: "utkarshc", course: courses.first, user: users.first}])
course_instructors = CourseInstructor.create([{username: "utkarsh", course: courses.first, user: users.second}])

sessions = Session.create([{name: "My Session", course: courses.first, course_instructor: course_instructors.first, start_time: Time.at(1558297380), end_time: Time.at(1558300980), address: "300 Bizzel St, College Station, TX", description: "This is a desc", batch: "some"}])


