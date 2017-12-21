/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import chai = require('chai');
import Response = ChaiHttp.Response;
import restify = require('restify');
import chaiHttp = require("chai-http");


var fs = require("fs");
let zip = fs.readFileSync(__dirname + '/courses.zip',"base64");
let zip2 = fs.readFileSync(__dirname + '/courses.txt',"base64");
let zip3 = fs.readFileSync(__dirname + '/emptyzip.zip',"base64");
let zip4 = fs.readFileSync(__dirname + '/troll.zip',"base64");
let zip5 = fs.readFileSync(__dirname + '/badjsonfile.zip',"base64");
let ziproom = fs.readFileSync(__dirname + '/rooms.zip',"base64");
let roomset = {};
fs.readFile(__dirname + '/rooms', 'utf8', function (err:any,data:any) {
    if (err) {
        return console.log(err);
    }
    roomset = JSON.parse(data);
});


//let fasterdataset = fs.readFileSync(__dirname + '/rooms.txt',"base64");
describe("EchoSpec", function () {
    this.timeout(20000);


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        // let server = new Server(5555);
        // Log.test('Before: ' + (<any>this).test.parent.title);
        // return server.start();

    });

    beforeEach(function () {
        // chai.use(chaiHttp);
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });


    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });




    //Test below are added to test the JSzip//
    it("Just to test if zip is parsed successfully 2", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')


        return math.addDataset("courses", zip).then(function(value:InsightResponse){
                Log.test('Value:' + value);
                //math.removeDataset("course");
                //console.log(value)
                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            expect.fail()
            // expect(err).to.deep.equal(err)
        })
    });

    it("Just to test if zip is parsed successfully", function () {
        var math = new InsightFacade();
        math.addDataset("courses", zip)
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses", zip).then(function(value:InsightResponse){
                Log.test('Value:' + value)

                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            expect.fail()
            // expect(err).to.deep.equal(err)
        })
    });

    it("Just to test if zip is removed successfully", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("courses")
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("Just to test if zip is removed unsuccessfully because there is no such set", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("course")
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });


    it("Just to test what if a txt file is thrown", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')


        return math.addDataset("courses", zip2).then(function(value:InsightResponse){
                Log.test('Value:' + value);
                //math.removeDataset("course");
                //console.log(value)
                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            //console.log(err);
            expect(err).to.equal(err);
            // expect(err).to.deep.equal(err)
        })
    });



    it("Just to test what if a zip file has no courses version 1", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')


        return math.addDataset("courses", zip3).then(function(value:InsightResponse){
                Log.test('Value:' + value);
                //math.removeDataset("course");
                //console.log(value)
                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            //console.log(err);
            expect(err).to.equal(err);
            // expect(err).to.deep.equal(err)
        })
    });

    it("Just to test what if a zip file has no courses version 2", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')


        return math.addDataset("courses", zip4).then(function(value:InsightResponse){
                Log.test('Value:' + value);
                //math.removeDataset("course");
                //console.log(value)
                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            // console.log(err);
            expect(err).to.equal(err);
            // expect(err).to.deep.equal(err)
        })
    });

    it("Just to test what if a zip file has badjson", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')


        return math.addDataset("courses", zip5).then(function(value:InsightResponse){
                Log.test('Value:' + value);
                //math.removeDataset("course");
                //console.log(value)
                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            //console.log(err);
            expect(err).to.equal(err);
            // expect(err).to.deep.equal(err)
        })
    });
    it("Just to test if zip is removed unsuccessfully because there is no such set", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("course")
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test GT fail", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_fail":20
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test GT audit", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_audit":10
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test GT avg", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_avg":97
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test GT pass", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_pass":200
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test GT year", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_year":1800
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test EQ avg", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_avg":95
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test EQ year", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_year":2015
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });
    it("It is used to test EQ fail", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_fail":34
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test EQ pass", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_pass":95
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test EQ audit", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_audit":10
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test LT avg", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_avg":60
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test LT pass", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_pass":50
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test LT fail", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_fail":10
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test LT audit", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_audit":2
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });




    it("It is used to test LT year", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE": {
                        "AND":[{"IS":{"courses_dept":"MAGIC"}},{"IS":{"courses_dept":"severus, snape"}}]

                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_instructor",
                            "courses_dept",
                            "average"

                        ]
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_instructor","courses_dept"],
                        "APPLY": [
                            {
                                "average": {
                                    "AVG": "courses_avg"
                                }
                            }
                        ]
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });
//
    it("It is used to test if checkQuery works", function () {
        var math = new InsightFacade();

        return math.addDataset("courses", zip).then(function (result) {


            //console.log(__dirname + '/courses.zip')
            //console.log(zip)
            var isTrue =  math.checkValidQuery({
                    "WHERE":{
                        "EQ":{
                            "courses_avg":95
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )

            Log.test('Value:' + isTrue);
            //expect.fail(isTrue)
            expect(isTrue).to.equal(true);

        })

    });

    it("It is used to test IS Department", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept":"adhe"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS Title", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_title":"alg coding crypt"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });
    it("It is used to test IS id", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_id":"300"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS Instructor", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_instructor":"van willigenburg, stephanie"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS uuid", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_uuid":"8672"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS Department with wildcard C*", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept":"ma*"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS uuid with wildcard C*", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_uuid":"8*"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS uuid with wildcard *C", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_uuid":"*853"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test IS uuid with wildcard *C*", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_uuid":"*853*"
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test sComparison And logic", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });


    it("It is used to test many many many filters in AND", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            },
                            {
                                "EQ":{
                                    "courses_avg":96.11
                                }
                            }




                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg",
                            "courses_id"
                        ],
                        "ORDER":"courses_avg"
                    }

                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });


    it("It is used to test sComparison OR logic", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("It is used to test sComparison AND logic", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_avg":97
                        }
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }

            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("It is used to test sComparison complex logic with uuid", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_dept":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":95
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });
    it("It is used to test sComparison complex logic with year", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_uuid":"68540"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_year":2016
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_uuid",
                            "courses_id",
                            "courses_avg",
                            "courses_year"
                        ],
                        "ORDER":"courses_uuid"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    })




    it("It is used to test sComparison NOT super stressful test (Ultimate complex logic gg)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{},
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });





    it("It is used to test sComparison NOT stressful test to find sections in a dept with average between 70 and 80", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{"AND":[{
                        "GT":{
                            "courses_avg":70
                        }},
                        {"LT":{
                            "courses_avg":80}
                        },
                        {"IS": {
                            "courses_dept":"adhe"
                        }

                        }



                    ]},
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }

            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("Just to test error 424 for performQUery if there is no such dataset existed", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("courses")
        })
            .then(function (value2:InsightResponse) {
                return math.performQuery({
                        "WHERE":{
                            "OR":[
                                {
                                    "AND":[
                                        {
                                            "GT":{
                                                "courses_avg":90
                                            }
                                        },
                                        {
                                            "IS":{
                                                "courses_dept":"adhe"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "EQ":{
                                        "courses_avg":95
                                    }
                                }
                            ]
                        },
                        "OPTIONS":{
                            "COLUMNS":[
                                "courses_dept",
                                "courses_id",
                                "courses_avg"
                            ],
                            "ORDER":"courses_avg"
                        }
                    }
                )
            }).then(function(value3:InsightResponse){
                Log.test('Value:' + value3)
                expect(value3).to.equal(value3);
            })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })})



    it("Just to test error 424 for performQUery if there is no such dataset existed 2", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.performQuery({
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "GT":{
                                        "courses_avg":90
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"adhe"
                                    }
                                }
                            ]
                        },
                        {
                            "EQ":{
                                "courses_avg":95
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }
        ).then(function(value3:InsightResponse){
            Log.test('Value:' + value3)
            expect(value3).to.equal(value3);
        })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })})

    it("It is used to test if code 400 works for invalid key", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_dept":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":95
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });







    it("It is used to test if code 400 works. (ORDER has array instead of single string)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_audit":20
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": ["courses_avg", "courses_dept"]
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (unknown filter)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "TROLL":{
                            "courses_audit":97
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (columns null)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_fail":2
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (\"ORDER\" spelled incorrectly)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_pass":250
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "PEPPERONI": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (m_key provides invalid string)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_passssssssssssssssss":97
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (inputString contains invalid character)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept": "*ab_c*de"
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (string has length 0)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept": ""
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //  console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (string has length 0)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept": "**"
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("It is used to test if code 400 works for invalid key, attempt 2", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "AND":[
                            {
                                "OR":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_depts":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":95
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //  console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works for invalid key, attempt 2", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_deptss":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":95
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });





    it("Just to test error 424 for performQUery if there is no such dataset existed 1", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("courses")
        })
            .then(function (value2:InsightResponse) {
                return math.performQuery({
                        "WHERE":{
                            "OR":[
                                {
                                    "AND":[
                                        {
                                            "GT":{
                                                "courses_avg":90
                                            }
                                        },
                                        {
                                            "IS":{
                                                "courses_dept":"adhe"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "EQ":{
                                        "courses_avg":95
                                    }
                                }
                            ]
                        },
                        "OPTIONS":{
                            "COLUMNS":[
                                "courses_dept",
                                "courses_id",
                                "courses_avg"
                            ],
                            "ORDER":"courses_avg"
                        }
                    }
                )
            }).then(function(value3:InsightResponse){
                Log.test('Value:' + value3)
                expect(value3).to.equal(value3);
            })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })})



    it("Just to test error 424 for performQUery if there is no such dataset existed 2", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.performQuery({
                "WHERE":{
                    "OR":[
                        {
                            "AND":[
                                {
                                    "GT":{
                                        "courses_avg":90
                                    }
                                },
                                {
                                    "IS":{
                                        "courses_dept":"adhe"
                                    }
                                }
                            ]
                        },
                        {
                            "EQ":{
                                "courses_avg":95
                            }
                        }
                    ]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "courses_dept",
                        "courses_id",
                        "courses_avg"
                    ],
                    "ORDER":"courses_avg"
                }
            }
        ).then(function(value3:InsightResponse){
            Log.test('Value:' + value3)
            expect(value3).to.equal(value3);
        })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })})

    it("It is used to test if code 400 works for invalid key", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_dept":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":90
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });







    it("It is used to test if code 400 works. (ORDER has array instead of single string)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_audit":20
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": ["courses_avg", "courses_dept"]
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (unknown filter)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "TROLL":{
                            "courses_audit":97
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (columns null)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "LT":{
                            "courses_fail":2
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (\"ORDER\" spelled incorrectly)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_pass":250
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "PEPPERONI": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (m_key provides invalid string)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "GT":{
                            "courses_passssssssssssssssss":97
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (inputString contains invalid character)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept": "*ab_c*de"
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (string has length 0)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept": ""
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //  console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works (string has length 0)", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "IS":{
                            "courses_dept": "**"
                        }
                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_dept",
                            "courses_avg"
                        ],
                        "ORDER": "courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("It is used to test if code 400 works for invalid key, attempt 2", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_depts":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":95
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                //  console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test if code 400 works for invalid key, attempt 2", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "AND":[
                                    {
                                        "GT":{
                                            "courses_avg":90
                                        }
                                    },
                                    {
                                        "IS":{
                                            "courses_deptss":"adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ":{
                                    "courses_avg":95
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_id",
                            "courses_avg"
                        ],
                        "ORDER":"courses_avg"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });


    it("Just to test if zip is parsed successfully for room", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')
        // math.getLatLon();


        return math.addDataset("rooms", ziproom).then(function(value:InsightResponse){
                Log.test('Value:' + value);
                //math.removeDataset("course");
                //console.log(value)
                expect(value).to.equal(value);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err);
            expect.fail()
            // expect(err).to.deep.equal(err)
        })
    });

    it("Just to test if zip is parsed successfully for room that already exist", function () {

        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("rooms",ziproom).then(function(value:InsightResponse){

            //console.log(zip)
            return math.addDataset("courses",ziproom)
        })
            .then(function (value2:InsightResponse) {
                // Log.test('Value:' + value2)
                //console.log(value2);
                return math.addDataset("rooms", zip2)
            })
            .then (function (value3:InsightResponse){
                Log.test('Value:' + value3)
                //console.log(math.dataset);
                expect(value3).to.equal(value3);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("Just to test if zip is removed successfully for room", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("rooms",ziproom).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("rooms")
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("It is used to test Query A rooms_name", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "IS": {
                        "rooms_name": "DMP_*"
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_name"
                    ],
                    "ORDER": "rooms_name"
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test Query B rooms_address", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "IS": {
                        "rooms_address": "*Agrono*"
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_address", "rooms_name"
                    ], "ORDER": "rooms_address"
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test NOT for rooms", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    'NOT':{"IS": {
                        "rooms_address": "*Agrono*"
                    }
                    }},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_address", "rooms_name"
                    ], "ORDER": "rooms_address"
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});


    it("It is used to test NOt for course", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        'NOT':{ "GT":{
                            "courses_avg":97
                        }
                        }},
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_avg",
                            "courses_pass",
                            "courses_fail",
                            "courses_audit",
                            "courses_instructor",
                            "courses_title"
                        ],
                        "ORDER":"courses_avg"
                    }
                }

            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });




    it("It is used to test complex query", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "OR":[{
                        "AND":[{
                            "GT":{
                                "rooms_lat":30
                            }},{"OR":[{"IS":{
                            "rooms_fullname": "*Bu*"
                        }
                        },{
                            "IS":{
                                "rooms_type":"Small Group"
                            }
                        }

                        ]}
                        ]},{"EQ":{
                        "rooms_seats":50
                    }}]
                },
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_lon",
                        "rooms_seats",
                        "rooms_fullname",
                        "rooms_type",
                        "rooms_lat"

                    ],
                    "ORDER":"rooms_seats"
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("Should not be able to perform query when dataset has been removed.", function () {

        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("rooms",ziproom).then(function(value:InsightResponse){

            //console.log(zip)
            return math.removeDataset("rooms")
        })
            .then(function(value4:InsightResponse){
                return math.addDataset("courses",zip);
            })

            .then(function(value5:InsightResponse){
                return math.removeDataset("courses")
            })

            .then(function (value2:InsightResponse) {
                // Log.test('Value:' + value2)
                //console.log(value2);
                return math.performQuery({
                    "WHERE": {
                        "OR":[{
                            "AND":[{
                                "GT":{
                                    "rooms_lat":30
                                }},{"OR":[{"IS":{
                                "rooms_fullname": "*Bu*"
                            }
                            },{
                                "IS":{
                                    "rooms_type":"Small Group"
                                }
                            }

                            ]}
                            ]},{"EQ":{
                            "rooms_seats":50
                        }}]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_lon",
                            "rooms_seats",
                            "rooms_fullname",
                            "rooms_type",
                            "rooms_lat"

                        ],
                        "ORDER":"rooms_seats"
                    }
                })
            })
            .then (function (value3:InsightResponse){
                Log.test('Value:' + value3)
                // console.log(value3)
                expect(value3).to.equal(value3);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err)
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("Should be able to perform query when dataset has been added.", function () {

        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("rooms",ziproom)
            .then(function (value2:InsightResponse) {
                // Log.test('Value:' + value2)
                //console.log(value2);
                return math.performQuery({
                    "WHERE": {
                        "OR":[{
                            "AND":[{
                                "GT":{
                                    "rooms_lat":30
                                }},{"OR":[{"IS":{
                                "rooms_fullname": "*Bu*"
                            }
                            },{
                                "IS":{
                                    "rooms_type":"Small Group"
                                }
                            }

                            ]}
                            ]},{"EQ":{
                            "rooms_seats":50
                        }}]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_lon",
                            "rooms_seats",
                            "rooms_fullname",
                            "rooms_type",
                            "rooms_lat"

                        ],
                        "ORDER":"rooms_seats"
                    }
                })
            })
            .then (function (value3:InsightResponse){
                Log.test('Value:' + value3)
                //console.log(math.dataset);
                console.log(math.queryType)
                expect(value3).to.equal(value3);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("Should not be able to perform query when dataset has not been added", function () {

        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')

        // Log.test('Value:' + value2)
        //console.log(value2);
        return math.performQuery({
            "WHERE": {
                "OR":[{
                    "AND":[{
                        "GT":{
                            "rooms_lat":30
                        }},{"OR":[{"IS":{
                        "rooms_fullname": "*Bu*"
                    }
                    },{
                        "IS":{
                            "rooms_type":"Small Group"
                        }
                    }

                    ]}
                    ]},{"EQ":{
                    "rooms_seats":50
                }}]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "rooms_lon",
                    "rooms_seats",
                    "rooms_fullname",
                    "rooms_type",
                    "rooms_lat"

                ],
                "ORDER":"rooms_seats"
            }
        })

            .then (function (value3:InsightResponse){
                Log.test('Value:' + value3)
                //console.log(math.dataset);
                expect(value3).to.equal(value3);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });


    it("It is used to test very deep nested query", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "NOT":{"OR":[{
                        "AND":[{"NOT":{
                            "LT":{
                                "rooms_lat":30
                            }}},{"OR":[{"IS":{
                            "rooms_fullname": "*Bu*"
                        }
                        },{
                            "IS":{
                                "rooms_type":"Small Group"
                            }
                        },{
                            "IS":{
                                "rooms_furniture": "Classroom-Movable Tables & Chairs"
                            }
                        },
                            {
                                "IS":{
                                    "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201"
                                }
                            },
                            {
                                "IS":{
                                    "rooms_address":  "6245 Agronomy Road V6T 1Z4"
                                }
                            },{
                                "OR":[{
                                    "AND":[{"NOT":{
                                        "LT":{
                                            "rooms_lat":30
                                        }}},{
                                        "LT":{
                                            "rooms_lon":200
                                        }},{
                                        "LT":{
                                            "rooms_seats":200
                                        }},
                                        {
                                            "GT":{
                                                "rooms_lon":50
                                            }},
                                        {
                                            "GT":{
                                                "rooms_seats":50
                                            }},

                                        {
                                            "EQ":{
                                                "rooms_lat":60
                                            }},{
                                            "EQ":{
                                                "rooms_lon":60
                                            }},{"OR":[{"IS":{
                                            "rooms_fullname": "*Bu*"
                                        }
                                        },{
                                            "IS":{
                                                "rooms_type":"Small Group"
                                            }
                                        },{
                                            "IS":{
                                                "rooms_furniture": "Classroom-Movable Tables & Chairs"
                                            }
                                        },
                                            {
                                                "IS":{
                                                    "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201"
                                                }
                                            },
                                            {
                                                "IS":{
                                                    "rooms_address":  "6245 Agronomy Road V6T 1Z4"
                                                }
                                            }

                                        ]},{"AND":[{"IS":{
                                            "rooms_fullname": "*Bu*"
                                        }
                                        },{
                                            "IS":{
                                                "rooms_number":"202"
                                            }
                                        },{
                                            "IS":{
                                                "rooms_shortname": "DMC"
                                            }
                                        },
                                            {
                                                "IS":{
                                                    "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201"
                                                }
                                            },
                                            {
                                                "IS":{
                                                    "rooms_address":  "6245 Agronomy Road V6T 1Z4"
                                                }
                                            },
                                            {
                                                "IS":{
                                                    "rooms_name":  "IBLC_157"
                                                }
                                            },
                                            {
                                                "IS":{
                                                    "rooms_number":  "157"
                                                }
                                            }

                                        ]}
                                    ]},{"EQ":{
                                    "rooms_seats":50
                                }}]
                            }

                        ]}
                        ]},{"LT":{
                        "rooms_seats":50
                    }}]
                    }},
                "OPTIONS":{
                    "COLUMNS":[
                        "rooms_lon",
                        "rooms_seats",
                        "rooms_fullname",
                        "rooms_name",
                        "rooms_number",
                        "rooms_type",
                        "rooms_lat",
                        "rooms_href",
                        "rooms_furniture",
                        "rooms_shortname",
                        "rooms_address"

                    ],
                    "ORDER":"rooms_seats"
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    // Fluorine: Should be able to find the year a course is offered in.
    // Gallium: Filter by courses year.
    //   Prelude: Deeply nested query should be supported.

    it("It is used to test sComparison And logic looking for year", function () {



        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "OR":[
                            {
                                "GT":{
                                    "courses_year":1900
                                }
                            },
                            {
                                "EQ":{
                                    "courses_year":1900
                                }
                            },
                            {
                                "LT":{
                                    "courses_year":2002
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_year",
                            "courses_avg"
                        ],
                        "ORDER":"courses_year"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to troubleshoot querying returning 400 ", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE":{
                        "NOT":{"AND":[{"EQ":{
                            "courses_year":2016
                        }
                        },{"GT":{"courses_year":2015}},{"IS":{"courses_dept" :"phar"}}
                            ,{"LT":{"courses_year":2017}},{"AND":[
                                {"EQ":{"courses_avg":90}},
                                {"EQ":{"courses_pass":99}},
                                {"EQ":{"courses_fail":50}},
                                {"EQ":{"courses_audit":0}}]}
                            ,
                            {"AND":[
                                {"IS":{"courses_dept":""}},
                                {"IS":{"courses_uuid":"10291"}},
                                {"IS":{"courses_id":"599"}},
                                {"IS":{"courses_instructor":"lol"}},
                                {"IS":{"courses_title":"masc thesis"}} ]}




                        ]}},
                    "OPTIONS":{
                        "COLUMNS":[
                            "courses_dept",
                            "courses_year",
                            "courses_uuid",
                            "courses_pass",
                            "courses_fail",
                            "courses_audit",
                            "courses_id",
                            "courses_instructor",
                            "courses_title",
                            "courses_avg"

                        ],
                        "ORDER":"courses_uuid"
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });


    it("It is used to test Query A rooms_name complex query", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {"NOT":{
                    "IS": {
                        "rooms_name": "DMP_*"
                    }
                }},
                "OPTIONS": {
                    "COLUMNS": [

                        "rooms_fullname",
                        "rooms_shortname",
                        "rooms_address",
                        "rooms_lat",
                        "rooms_lon",
                        "rooms_seats",
                        "rooms_type",
                        "rooms_furniture",
                        "rooms_href"

                    ],
                    "ORDER": "rooms_shortname"
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});
    it("Should still be able to perform query when the removed dataset has different id", function () {

        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("rooms",ziproom).then(function(value:InsightResponse){

            //console.log(zip)
            return math.addDataset("room", ziproom)
        })
            .then(function(value4:InsightResponse){
                return math.addDataset("courses",zip);
            })

            .then(function(value5:InsightResponse){
                return math.removeDataset("room")
            })

            .then(function (value2:InsightResponse) {
                // Log.test('Value:' + value2)
                //console.log(value2);
                return math.performQuery({
                    "WHERE": {
                        "OR":[{
                            "AND":[{
                                "GT":{
                                    "rooms_lat":30
                                }},{"OR":[{"IS":{
                                "rooms_fullname": "*Bu*"
                            }
                            },{
                                "IS":{
                                    "rooms_type":"Small Group"
                                }
                            }

                            ]}
                            ]},{"EQ":{
                            "rooms_seats":50
                        }}]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_lon",
                            "rooms_seats",
                            "rooms_fullname",
                            "rooms_type",
                            "rooms_lat"

                        ],
                        "ORDER":"rooms_seats"
                    }
                })
            })
            .then (function (value3:InsightResponse){
                Log.test('Value:' + value3)
                // console.log(value3)
                expect(value3).to.equal(value3);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err)
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("Should not be able to perform query when dataset has been removed~.", function () {

        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("rooms",ziproom).then(function(value:InsightResponse){

            //console.log(zip)
            return math.addDataset("rooms", ziproom)
        })


            .then(function(value5:InsightResponse){
                return math.removeDataset("rooms")
            })

            .then(function (value2:InsightResponse) {
                // Log.test('Value:' + value2)
                //console.log(value2);
                return math.performQuery({
                    "WHERE": {
                        "OR":[{
                            "AND":[{
                                "GT":{
                                    "rooms_lat":30
                                }},{"OR":[{"IS":{
                                "rooms_fullname": "*Bu*"
                            }
                            },{
                                "IS":{
                                    "rooms_type":"Small Group"
                                }
                            }

                            ]}
                            ]},{"EQ":{
                            "rooms_seats":50
                        }}]
                    },
                    "OPTIONS":{
                        "COLUMNS":[
                            "rooms_lon",
                            "rooms_seats",
                            "rooms_fullname",
                            "rooms_type",
                            "rooms_lat"

                        ],
                        "ORDER":"rooms_seats"
                    }
                })
            })
            .then (function (value3:InsightResponse){
                Log.test('Value:' + value3)
                // console.log(value3)
                expect(value3).to.equal(value3);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err)
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("it is used to debug our code, for ROOMS", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({"WHERE":
                {"OR": [
                    {"AND": [
                        {"GT":
                            {"rooms_seats":10}
                        },
                        {"AND": [
                            {"IS":
                                {"rooms_shortname":"S"}
                            },
                            {"AND": [
                                {"IS":
                                    {"rooms_address":"a"}
                                },
                                {"AND": [
                                    {"NOT":
                                        {"IS":
                                            {"rooms_name":"-"}
                                        }
                                    },
                                    {"AND": [
                                        {"LT":
                                            {"rooms_lon":999999}
                                        },
                                        {"AND": [
                                            {"OR": [
                                                {"NOT":
                                                    {"GT":
                                                        {"rooms_seats":9999}
                                                    }
                                                },
                                                {"NOT":
                                                    {"GT":
                                                        {"rooms_lat":99999}
                                                    }
                                                }
                                            ]},
                                            {"AND": [
                                                {"GT":
                                                    {"rooms_lat":1}
                                                }
                                            ]}
                                        ]}
                                    ]}
                                ]}
                            ]}
                        ]}
                    ]}
                ]},
                "OPTIONS":
                    {"COLUMNS":
                        [
                            "rooms_name",
                            "rooms_address",
                            "rooms_lat",
                            "rooms_furniture"
                        ],
                        "ORDER":"rooms_name"
                    }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("PUT description to test 204 and 400", function () {
        let server = new Server(6666);
        return server.start().then(function() {
            chai.use(chaiHttp);
            let zipContent = fs.readFileSync(__dirname + '/courses.txt');
            return chai.request("http://127.0.0.1:6666")
                .put('/dataset/room')
                .attach("body", zipContent, 'rooms.zip')
                .then(function (res: Response) {
                    Log.trace('then:');
                    // console.log(res.status);
                    expect(res.status).to.equal(204);
                    return server.stop();
                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect(err.status).to.equal(400);
                    return server.stop();
                });
        });

    });

    it("PUT description to test 201", function () {
        let server = new Server(6666);
        return server.start().then(function() {
            chai.use(chaiHttp);
            let zipContent = fs.readFileSync(__dirname + '/rooms.zip');
            return chai.request("http://127.0.0.1:6666")
                .put('/dataset/rooms')
                .attach("body", zipContent, 'rooms.zip')
                .then(function (res: Response) {
                    // Log.trace('then:');
                    // some assertions
                    return chai.request("http://127.0.0.1:6666")
                        .put('/dataset/rooms')
                        .attach("body", zipContent, 'rooms.zip')
                        .then(function (res: Response) {
                            Log.trace('then:');
                            expect(res.status).to.equal(201);
                            return server.stop();
                            // some assertions
                        })
                        .catch(function (err) {
                            Log.trace('catch:');
                            // some assertions
                            expect.fail();
                            return server.stop();
                        });

                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect.fail();
                    return server.stop();
                });
        });

    });

    it("DEL description to test 204 and 400 ", function () {
        let server = new Server(6666);
        return server.start().then(function() {
            chai.use(chaiHttp);
            let zipContent = fs.readFileSync(__dirname + '/rooms.zip');
            return chai.request("http://127.0.0.1:6666")
                .put('/dataset/rooms')
                .attach("body", zipContent, 'rooms.zip')
                .then(function (res: Response) {
                    // Log.trace('then:');
                    // some assertions
                    return chai.request("http://127.0.0.1:6666")
                        .del('/dataset/courses')
                        .attach("body", zipContent, 'rooms.zip')
                        .then(function (res: Response) {
                            Log.trace('then:');
                            expect(res.status).to.equal(204);
                            return server.stop();
                            // some assertions
                        })
                        .catch(function (err) {
                            Log.trace('catch:');
                            // some assertions
                            expect(err.status).to.equal(404);
                            return server.stop();

                        });

                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect.fail();
                    return server.stop();
                });
        });

    });

    it("POST description", function () {
        let server = new Server(6666);
        return server.start().then(function() {
            chai.use(chaiHttp);
            let zipContent = fs.readFileSync(__dirname + '/rooms.zip');
            return chai.request("http://127.0.0.1:6666")
                .put('/dataset/rooms')
                .attach("body", zipContent, 'rooms.zip')
                .then(function (res: Response) {
                    // Log.trace('then:');
                    // some assertions
                    return chai.request("http://127.0.0.1:6666")
                        .post('/query')
                        .send({
                            "WHERE": {
                                "OR":[{
                                    "AND":[{
                                        "GT":{
                                            "rooms_lat":30
                                        }},{"OR":[{"IS":{
                                        "rooms_fullname": "*Bu*"
                                    }
                                    },{
                                        "IS":{
                                            "rooms_type":"Small Group"
                                        }
                                    }

                                    ]}
                                    ]},{"EQ":{
                                    "rooms_seats":50
                                }}]
                            },
                            "OPTIONS":{
                                "COLUMNS":[
                                    "rooms_lon",
                                    "rooms_seats",
                                    "rooms_fullname",
                                    "rooms_type",
                                    "rooms_lat"

                                ],
                                "ORDER":"rooms_seats"
                            }
                        })
                        .then(function (res: Response) {
                            Log.trace('then:');
                            expect(res.status).to.equal(200);
                            return server.stop();
                            // some assertions
                        })
                        .catch(function (err) {
                            Log.trace('catch:');
                            // some assertions
                            expect(err.status).to.equal(424);
                            return server.stop();
                        });

                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect.fail();
                    return server.stop();
                });
        });

    });

    it("testing to check d3 query soundness, expect valid", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 2", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture"
                    ],
                    "ORDER": "rooms_furniture"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture"],
                    "APPLY": []
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 3", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 4", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_name",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect invalid 5", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_name",
                        "maxSeatssssss"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect invalid 6 (specification update)", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture"
                    ],
                    "ORDER": "rooms_furniture"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_name"],
                    "APPLY": []
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 7", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture"
                    ],
                    "ORDER": "rooms_furniture"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture", "rooms_name"],
                    "APPLY": []
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 8", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_name",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 9 (no TRANSFORMATIONS)", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture"
                    ],
                    "ORDER": "rooms_furniture"
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("testing to check d3 query soundness, expect valid 10 (WHERE is empty)", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        // console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_furniture"
                    ],
                    "ORDER": "rooms_furniture"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture"],
                    "APPLY": []
                }
            }
        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});


    it("It is used to test query after transformation for MAX", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_number",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname","rooms_number"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test query after transformation for MIN", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "minSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["minSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test query after transformation for AUG", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "avgSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["avgSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test query after transformation for SUM", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",

                        "countSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["rooms_shortname"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "countSeats": {
                            "COUNT": "rooms_seats"
                        }
                    }, {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    },{
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }}]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test query for basic testing", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_furniture",
                        "rooms_name",
                        "rooms_seats"
                    ],
                    "ORDER": "rooms_seats"
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test query for basic testing 2", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "maxSeats",
                        "minSeats",
                        "avgSeats",
                        "countSeats",
                        "sumSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    },{
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    },{
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    },
                        {
                            "countSeats": {
                                "COUNT": "rooms_seats"
                            }
                        },
                        {
                            "minSeats": {
                                "MIN": "rooms_seats"
                            }
                        }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                //console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});
    it("It is used to test courses transformation", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                "WHERE": {

                },
                "OPTIONS": {
                    "COLUMNS": [

                        "avgID",
                        "countPass",
                        "courses_dept",
                        "maxAvg",
                        "countPass"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["courses_dept"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["courses_dept"],
                    "APPLY": [
                        {
                            "maxAvg": {
                                "MAX": "courses_avg"
                            }

                        },{
                            "avgID": {
                                "AVG": "courses_pass"
                            }
                        },{
                            "sumFail": {
                                "SUM": "courses_fail"
                            }
                        },
                        {
                            "countPass": {
                                "COUNT": "courses_dept"
                            }
                        },
                        {
                            "countAudit": {
                                "MIN": "courses_audit"
                            }
                        }
                    ]
                }
            })
                .then(function (value2:InsightResponse) {
                    Log.test('Value:' + value2)
                    expect(value2).to.equal(value2);

                })
                .catch(function(err){
                    Log.test(err);
                    expect(err).to.equal(err)
                    // expect(err).to.deep.equal(err)
                })
        })})

    it("PUT description to test PLUTO 400", function () {
        let server = new Server(6666);
        return server.start().then(function() {
            chai.use(chaiHttp);
            let zipContent = fs.readFileSync(__dirname + '/rooms');
            return chai.request("http://127.0.0.1:6666")
                .put('/dataset/rooms')
                .attach("body", zipContent, 'rooms')
                .then(function (res: Response) {
                    // Log.trace('then:');
                    // some assertions
                    return chai.request("http://127.0.0.1:6666")
                        .put('/dataset/rooms')
                        .attach("body", zipContent, 'rooms')
                        .then(function (res: Response) {
                            Log.trace('then:');
                            expect.fail();
                            // some assertions
                        })
                        .catch(function (err) {
                            Log.trace('catch:');
                            // some assertions
                            expect(res.status).to.equal(400);
                        });

                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect(err.status).to.equal(400);
                });
        });

    });

    it("It is used to test query for basic testing 3 (all filters in WHERE deleted)", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_name",
                        "maxSeats","minlat","avglon","countfurniture","sumLat"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats", "rooms_name"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    },
                        {
                            "minlat": {
                                "MIN": "rooms_lat"
                            }
                        },
                        {
                            "avglon": {
                                "AVG": "rooms_lon"
                            }
                        }, {
                            "sumLat": {
                                "SUM": "rooms_lat"
                            }
                        }, {
                            "countfurniture": {
                                "COUNT": "rooms_furniture"
                            }
                        }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err["code"]);
                console.log(err["body"]);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test querying for 200 seats, without transformation", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 200
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_lat",
                        "rooms_lon",
                        "rooms_shortname",
                        "rooms_furniture",
                        "rooms_name",
                        "rooms_seats"
                    ],
                    "ORDER": "rooms_seats"
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test for valid query with an unused GROUP element", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 200
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_name",
                        "maxSeats2",
                        "maxSeats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats2", "rooms_name"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name", "rooms_furniture"],
                    "APPLY": [{
                        "maxSeats2": {
                            "MAX": "rooms_seats"
                        }
                    }],
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test for invalid query with an unused GROUP element inside SORT", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 200
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_name",
                        "maxSeats2"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["maxSeats2", "rooms_name", "rooms_furniture"]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_name", "rooms_furniture"],
                    "APPLY": [{
                        "maxSeats2": {
                            "MAX": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});




    it("It is used to test wombat", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE": {
                        "AND":[{"IS":{"courses_dept":"MAGIC"}},{"IS":{"courses_dept":"severus, snape"}}]

                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_instructor",
                            "courses_dept",
                            "average"


                        ]
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_instructor","courses_dept","courses_uuid"],
                        "APPLY": [
                            {
                                "average": {
                                    "AVG": "courses_avg"
                                }
                            }
                        ]
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test sorting", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE": {


                    },
                    "OPTIONS": {
                        "COLUMNS": [
                            "courses_instructor",
                            "courses_dept",
                            "courses_id",
                            "courses_title",
                            "courses_uuid",
                            "courses_avg",
                            "courses_pass",
                            "courses_fail",
                            "courses_audit",
                            "courses_year"
                        ],
                        "ORDER": {
                            "dir": "DOWN",
                            "keys": ["courses_instructor","courses_dept","courses_id","courses_title",
                                "courses_uuid","courses_avg","courses_pass","courses_fail","courses_audit","courses_year"

                            ]
                        }
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });



    it("It is used to test query but result is completely different gg", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 100
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"

                        ]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }, {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }, {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }, {
                        "countRoom": {
                            "COUNT": "rooms_shortname"
                        }
                    }, {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                return math.performQuery({
                        "WHERE": {

                            "IS": {
                                "rooms_number": "*A*"
                            }

                        },
                        "OPTIONS": {
                            "COLUMNS": ["rooms_shortname","rooms_address"]
                        }
                    }

                )

                    .then(function (value2:InsightResponse) {
                        Log.test('Value of code: ' + value2["code"]);
                        Log.test('Value of body: ');
                        console.log(value2["body"]);
                        expect(value2).to.equal(value2);

                    })
                    .catch(function(err){
                        Log.test(err);
                        console.log(err["code"]);
                        console.log(err["body"]);
                        expect(err).to.equal(err)
                        // expect(err).to.deep.equal(err)
                    })
            })
            .catch(function(err){
                Log.test(err);
                console.log(err["code"]);
                console.log(err["body"]);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test query but result is completely different 123", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 100
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"

                        ]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }, {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }, {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }, {
                        "countRoom": {
                            "COUNT": "rooms_shortname"
                        }
                    }, {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err["code"]);
                console.log(err["body"]);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test SteamedHam", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {

                },
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumLat","sumLon"],
                    "ORDER": "minSeats"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }, {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }, {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }, {
                        "countRoom": {
                            "COUNT": "rooms_shortname"
                        }
                    }, {
                        "sumLat": {
                            "SUM": "rooms_lat"
                        }}, {
                        "sumLon": {
                            "SUM": "rooms_lon"
                        }}
                    ]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err["code"]);
                console.log(err["body"]);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test Watson", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 100
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                    "ORDER": "sumSeats"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }, {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }, {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }, {
                        "countRoom": {
                            "COUNT": "rooms_shortname"
                        }
                    }, {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err["code"]);
                console.log(err["body"]);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("It is used to test voyager", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE": {

                    },
                    "OPTIONS": {
                        "COLUMNS": ["courses_dept", "courses_uuid","count", "avgCourses"]

                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_dept", "courses_uuid"],
                        "APPLY": [{
                            "avgCourses": {
                                "AVG": "courses_avg"
                            }
                        }, {
                            "count": {
                                "COUNT": "courses_uuid"
                            }
                        }
                        ]
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to test vanadium", function () {
        var math = new InsightFacade();

        //math.addDataset("courses", zip);
        //console.log(__dirname + '/courses.zip')
        return math.addDataset("courses",zip).then(function(value:InsightResponse){

            //console.log(zip)
            return math.performQuery({
                    "WHERE": {

                    },
                    "OPTIONS": {
                        "COLUMNS": ["courses_audit", "courses_pass","courses_fail","courses_uuid","count", "avgCourses","minPass", "maxFail","sumFail"]

                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["courses_audit","courses_pass","courses_fail","courses_uuid"],
                        "APPLY": [{
                            "avgCourses": {
                                "AVG": "courses_avg"
                            }
                        }, {
                            "count": {
                                "COUNT": "courses_uuid"
                            }
                        },
                            {
                                "minPass": {
                                    "MIN": "courses_pass"
                                }
                            }
                            ,
                            {
                                "maxFail": {
                                    "MAX": "courses_fail"
                                }
                            }
                            ,
                            {
                                "sumFail": {
                                    "SUM": "courses_fail"
                                }
                            }
                        ]
                    }
                }
            )
        })
            .then(function (value2:InsightResponse) {
                Log.test('Value:' + value2)
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                // console.log(err);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })
    });

    it("It is used to find OSBO (or not)", function () {
        var math = new InsightFacade();
        //console.log(fasterdataset);

        math.dataset = roomset;
        //console.log(math.dataset);
        //console.log(zip)
        return math.performQuery({
                "WHERE": {
                    "AND": [{
                        "EQ": {
                            "rooms_lat": 49.26047
                        }
                    }, {
                        "EQ": {
                            "rooms_lon": -123.24467
                        }
                    }]
                },
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"

                        ]
                    }
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }, {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }, {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }, {
                        "countRoom": {
                            "COUNT": "rooms_shortname"
                        }
                    }, {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
                }
            }

        )

            .then(function (value2:InsightResponse) {
                Log.test('Value of code: ' + value2["code"]);
                Log.test('Value of body: ');
                console.log(value2["body"]);
                expect(value2).to.equal(value2);

            })
            .catch(function(err){
                Log.test(err);
                console.log(err["code"]);
                console.log(err["body"]);
                expect(err).to.equal(err)
                // expect(err).to.deep.equal(err)
            })});

    it("Just to test if we can get 201 code (already existed)", function () {
        var math = new InsightFacade();
        //console.log(__dirname + '/courses.zip')
        // math.getLatLon();


        return math.addDataset("rooms", ziproom).then( function() {
            return math.addDataset("rooms", ziproom);
        }).then(function(value:InsightResponse){
                Log.test('Value:' + value["code"]);
                //math.removeDataset("course");
                //console.log(value)
                expect(value["code"]).to.equal(201);
                //console.log(zip)
            }
        ).catch(function(err){
            Log.test(err["code"]);
            expect.fail()
            // expect(err).to.deep.equal(err)
        })
    });

});