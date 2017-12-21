/**
 * This is the main programmatic entry point for the project.
 */
import {GeoResponse, IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";
import {TooManyRequestsError} from "restify";
import Nyan = Mocha.reporters.Nyan;
import {stringify} from "querystring";
var JSZip = require("jszip");
var fs = require("fs");


export default class InsightFacade implements IInsightFacade {

    dataset:any;
    addeddataset:any;
    buildingsOfUBC: any;
    queryType : string;
    applyKeyStringArray: string[];
    groupArray: string[];
    countgroupnumnberkey: number;


    constructor() {
        Log.trace('InsightFacadeImpl::init()');
        this.dataset = {};
        this.addeddataset = {};
        this.buildingsOfUBC = {};
        this.queryType = "undefined";
        this.applyKeyStringArray = [];
        this.groupArray = [];
        this.countgroupnumnberkey;

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        var pArr:Array<Object> = [];
        var zip = new JSZip();
        var that = this;
        var parse5 = require('parse5');
        var promiseArray: Array<Object> = new Array<Object>();

        if(id === 'courses'){
            return new Promise(function (fulfill, reject) {



                zip.loadAsync(content, {base64: true}).then(function (new_zip: JSZip) {

                    //let files = new_zip.files

                    //console.log(file)


                    new_zip.forEach(function (relativePath, file){
                        //console.log("iterating over", file.name);
                        if (file.dir === false) {


                            pArr.push(new_zip.file(relativePath).async("string")

                                .then(function success(result: string) {
                                    //console.log(result)
                                    var jobject = JSON.parse(result);
                                    // console.log(jobject)
                                    delete jobject["rank"];
                                    if (jobject['result'].length != 0) {
                                        //console.log(listofcourses)
                                        return jobject
                                    }
                                    else {
                                        return null;
                                    }
                                    //console.log(pArr)
                                })
                                .catch(function () {
                                    // console.log("this json will be skipped")
                                }))
                        }

                    });

                    Promise.all(pArr).then(function(troll:Array<any>){
                        //console.log(troll)
                        var coursesinonelist = that.removeNullAndMakeOneBigListOfCourses(troll); //my own method to remove invalid items
                        //console.log(coursesinonelist);

                        that.helperToTurnAllYearToNumberAndReplaceOverall(coursesinonelist);

                        if (coursesinonelist.length === 0){
                            reject({ "code":400,"body":{"error": "there is not a single course section" }})
                        }

                        if (that.dataset.hasOwnProperty(id) ) {
                            that.dataset[id] = coursesinonelist;// dataset contains everything that has been added and is in the memory
                            that.addeddataset  = {};          //addeddataset contains only the new zip info
                            that.addeddataset[id] = coursesinonelist;
                            //console.log(that.dataset)
                            that.outputDataSetToDisk(id,that.addeddataset);
                            // var gg= fs.readFile(id)
                            //console.log(gg)
                            //that.dataset["gg"] = 2
                            //console.log(that.dataset)
                            fulfill({
                                "code": 201, "body": {"success": "the operation was successful and the id already existed"}
                            })
                            //console.log(that.dataset)

                        }
                        else {that.dataset[id] = coursesinonelist;
                            that.addeddataset  = {};
                            that.addeddataset[id] = coursesinonelist;
                            that.dataset[id] = coursesinonelist;
                            that.outputDataSetToDisk(id,that.addeddataset);
                            //that.dataset["bb"] = "234";
                            //console.log(that.dataset)
                            fulfill({
                                "code": 204, "body": {"success": "the operation was successful and the id was new"}
                            })
                        }


                    })
                        .catch(function (err){
                            //console.log("Promise.all rejected from" + err)
                            reject(err);
                        })


                })
                    .catch(function (err:any) {
                        // console.log(err)
                        reject({ "code":400,"body":{"error": "this is not a zip file. Trace path: addDataSet->courses->promise.all->error thrown and caught"} })
                    })
            })}

        else if (id==='rooms'){
            return new Promise(function(fulfill, reject) {
                zip.loadAsync(content, {base64: true}).then(function(zipFolder: JSZip) {
                    var zipFile = zipFolder; //.folder("campus").folder("discover").folder("buildings-and-classrooms");
                    zipFile.forEach(function(currentPath, fileThing) {
                        // console.log("our current path is: " + currentPath);
                        // console.log("our current fileThing is: ");  a compressed file that needs decompressing!
                        // console.log(fileThing); <- compressed file
                        if (fileThing.dir === false) {
                            // do something
                            // idea: just grab html, go into html and then grab further info from there. Do it in one go if need be.
                            promiseArray.push(zipFile.file(currentPath).async("string").then(
                                function hasFile(decompressedFile: string) {   // decompresses file, then does stuff
                                    // do stuff
                                    // console.log(currentPath);
                                    if (currentPath === "index.htm") {
                                        var parsedObject = parse5.parse(decompressedFile);
                                        // console.log("what we have inside index.htm is: ");
                                        // console.log(parsedObject);

                                        // parsedObject definitely holds "tbody", but I do not know how to access tbody.
                                        // must use recursion to find the wanted point!
                                        // use recursion to return tbody, then use link to find further information.
                                        // finally, call another helper function to pull from http address. Use D0's functions for calling
                                        // the html JSON object!

                                        // tBodyObject gets us the contents of tbody
                                        var tBodyObject = that.traverser(parsedObject);
                                        // console.log("tbody should be found now.");
                                        //console.log("going into tCleaner with tbody.");
                                        // buildingsOfUBC is previously called tBodyCleaned
                                        that.buildingsOfUBC = that.tCleaner(tBodyObject, "index");
                                        // console.log("contents of buildingsOfUBC: ");
                                        //console.log(that.buildingsOfUBC);

                                        return; // gonna cause undefined but it will be handled
                                    }
                                    else if (!(currentPath.includes("DS_store"))){
                                        // do something!
                                        // remember, currentPath is a string, eg ALRD
                                        // call for-loop here to iterate through the rooms
                                        var document = parse5.parse(decompressedFile);
                                        var documentWithName: any = new Object();
                                        documentWithName["name"] = currentPath;
                                        documentWithName["content"] = document;
                                        // console.log("document with name " + documentWithName["name"] + " is in promise array");
                                        // console.log("(checking: supposed to be called " + currentPath + ".)");
                                        return documentWithName;

                                    }
                                    else {
                                        console.log("not doing anything with: " + currentPath);
                                    }
                                }


                                )
                            );
                        }

                    })
                    Promise.all(promiseArray).then( function(buildingCandidates: Array<Object>) {

                        // console.log("the value of that in promise.all: " + that);
                        let holderOfAllThingsTroll: Array<any> = new Array<any>();

                        for (let buildingWithName of buildingCandidates) {
                            let roomsOfTheBuilding: Array<any>;
                            // console.log("going into recursive function for " + buildingWithName);
                            if (typeof buildingWithName !== "undefined") {
                                roomsOfTheBuilding = that.roomOperator(buildingWithName);
                            }
                            if (typeof roomsOfTheBuilding === "undefined") {
                                // console.log("there appears to be undefined returning as roomsOfTheBuilding from our Promise.all");
                                // console.log("fixing with roomsOfTheBuilding = []");
                                roomsOfTheBuilding = [];
                            }
                            for (let room of roomsOfTheBuilding) {
                                // console.log("pushing room onto roomsOfUBC");
                                holderOfAllThingsTroll.push(room);
                            }
                        }

                        if (that.dataset.hasOwnProperty(id)){
                            that.putLatLonInList(that.buildingsOfUBC).then(function (buildingsOfUBCWithLatLon) {

                                that.helperToPutLatLonToRoom(buildingsOfUBCWithLatLon, holderOfAllThingsTroll);

                                var roomset = holderOfAllThingsTroll;
                                that.dataset[id] = roomset;
                                that.addeddataset = {};
                                that.addeddataset[id] = roomset;
                                //console.log(roomset);
                                that.outputDataSetToDisk(id, that.addeddataset);
                                fulfill({
                                    "code": 201, "body": {"success": "the operation was successful and the id already existed"}
                                });
                            })
                                .catch(function (err){
                                    reject('putLatLonInListProblem')
                                })


                        }

                        else {
                            that.putLatLonInList(that.buildingsOfUBC).then(function (buildingsOfUBCWithLatLon) {
                                //
                                // console.log(buildingsOfUBCWithLatLon);
                                // console.log(holderOfAllThingsTroll);
                                that.helperToPutLatLonToRoom(buildingsOfUBCWithLatLon, holderOfAllThingsTroll);

                                var roomset = holderOfAllThingsTroll;
                                that.dataset[id] = roomset;
                                that.addeddataset = {};
                                that.addeddataset[id] = roomset;
                                //console.log(roomset);
                                that.outputDataSetToDisk(id, that.addeddataset);
                                fulfill({
                                    "code": 204, "body": {"success": "the operation was successful and the id was new"}
                                });
                            })
                                .catch(function (err) {
                                    reject('putLatLonInListProblem')
                                })
                        }


                        //console.log(that.addeddataset = holderOfAllThingsTroll);
                        //fulfill({"code": 200, "message": "trololol we're done with addDataSet"});
                    }).catch(function (err) {
                        //console.log("something broke!");
                        reject(err.message)
                    })
                }).catch(function (err:any) {
                    console.log("something broke!");
                    reject({"code":400,"body":{"error": "this is not a zip file, error occured at addDataSet->rooms->promise.all"}})
                })
            })
        }

        return new Promise(function(fulfill, reject) {

            zip.loadAsync(content, {base64: true}).then(function (zipFolder: JSZip) {
                if (that.dataset.hasOwnProperty(id)) {
                    that.dataset[id] = [];
                    that.addeddataset = {};
                    that.addeddataset[id] = [];
                    that.outputDataSetToDisk(id, that.addeddataset);
                    fulfill({
                        "code": 201, "body": {"success": "the operation was successful and the id already existed"}
                    });

                }
                else {
                    that.dataset[id] = [];
                    that.addeddataset = {};
                    that.addeddataset[id] = [];
                    that.outputDataSetToDisk(id, that.addeddataset);
                    fulfill({
                        "code": 204, "body": {"success": "the operation was successful and the id is newroo"}
                    });

                }

            }).catch(function(err:any){
                reject({"code":400,"body":{"error": "this is not a zip file, error occured at addDataSet->other ids"}});
            })
        })


    }

    helperToTurnAllYearToNumberAndReplaceOverall(coursesinonelist:Array<any>){
        //console.log(coursesinonelist.length);

        for(let i of coursesinonelist){
            i['Year'] = parseInt(i['Year'], 10);
            if(i['Section']==='overall'){
                i['Year'] = 1900;
            }
            // console.log(i['Year']);
        }
    };

    helperToPutLatLonToRoom(buildingsOfUBCWithLatLon:Array<any>, holderOfAllThingsTroll:Array<any> ){
        for (let a in buildingsOfUBCWithLatLon){
            //  console.log(buildingsOfUBCWithLatLon[a]['rooms_fullname']);
            for (let b in holderOfAllThingsTroll){
                //console.log(holderOfAllThingsTroll[b]['rooms_fullname']);
                if (buildingsOfUBCWithLatLon[a]['rooms_fullname'] === holderOfAllThingsTroll[b]['rooms_fullname'] ){
                    holderOfAllThingsTroll[b]['rooms_lat'] = buildingsOfUBCWithLatLon[a]['rooms_lat'];
                    holderOfAllThingsTroll[b]['rooms_lon'] = buildingsOfUBCWithLatLon[a]['rooms_lon'];
                }

            }
        }

    }
    putLatLonInList(infoindexarray:Array<any>):Promise<Array<any>>{
        var that = this;
        var listoflatlon:Array<any> = [];

        return new Promise(function (fulfill, reject) {
            // console.log(infoindexarray);

            for (let i of infoindexarray){
                listoflatlon.push(that.getLatLon(i['rooms_address']).then(function(onelatlon){
                    var lat = onelatlon['lat'];
                    var lon = onelatlon['lon'];
                    i['rooms_lat'] = lat;
                    i['rooms_lon'] = lon;
                    // console.log(i);
                    return i;
                    //return onelatlon;
                })
                    .catch(function (err)
                    {reject(err)}));
            }

            Promise.all(listoflatlon).then(function(troll:Array<any>){
                //console.log(troll.length);
                fulfill(troll);
            })
                .catch(function (err){
                    //console.log("Promise.all rejected from" + err)
                    reject(err);
                })


        })

    }

    getLatLon(address:string):Promise<GeoResponse>{
        return new Promise(function (fulfill, reject) {
            const http = require('http');
            var str = address;
            var newstr = str.replace(/ /g, "%20");
            //console.log (newstr);


            http.get('http://skaha.cs.ubc.ca:11316/api/v1/team61/' + newstr , (resp:any) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk:any) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    //console.log(JSON.parse(data));
                    fulfill((JSON.parse(data)));
                });

            }).on("error", (err:any) => {
                // console.log("Error: " + err.message);
                reject(err.message);

            });


        })
    }



    traverser(htmlObject: any): any {   // which data type is this?
        let that = this;

        /*
        if (htmlObject.constructor === Array) {
            for (let subElement of htmlObject) {
                let result = that.traverser(subElement);
                if (result !== null) {
                    return result;
                }
            }
        }
        */
        // if there is nothing left, we return null
        if (htmlObject === null || htmlObject === undefined) {
            return null;
        }

        // if we finally hit what we want, we return the contents of tbody
        if (htmlObject["nodeName"] === "tbody") {
            // do something
            // console.log("tbody found! finally...");
            // console.log("tbody value: " + htmlObject);
            return htmlObject;
        }

        // if we don't hit neither, do more recursion
        else {
            var children = htmlObject["childNodes"];
            if (children === undefined) {
                return null;
            }
            // console.log(children);
            for (let child of children) {
                let result = that.traverser(child);
                if (result !== null) {
                    return result;
                }
            }
            if (children.length === 0) {
                // console.log("this case was overlooked by for-loop! children's value is: " + children);
                // console.log(children);
                // console.log("\nchildren's type is: " + typeof children);
                return null; // safeguards against cases where childNodes = array[0] and/or other weird stuff!
            }
            return null // <----------- apparently I need this, or else it doesn't work... weird!
            // I need it because this is where nothing is found inside these branches
        }
    }


    // takes in the tbody,and whether the input is for a specific building or for the index.
    tCleaner(tbody: any, fileType: string): any {
        let that = this;
        var neededJSONs = new Array<any>();
        // console.log("inside tCleaner helper function");
        // console.log("tbody contents: " + tbody);
        let tbodyList = tbody["childNodes"];
        // console.log("list of child nodes of tbody:" + tbodyList);
        for (let subTbody of tbodyList) {
            // we are in child nodes now, and we only want tr items
            if (subTbody["nodeName"] === "tr") {
                if (fileType === "index") {
                    var neededJSON = that.tCleanerHelper(subTbody);
                    neededJSONs.push(neededJSON);
                }
                else if (fileType === "building") {
                    var neededJSON = that.tCleanerHelperRoom(subTbody);
                    neededJSONs.push(neededJSON);
                }
                else {
                    //console.log("ERROR IN TCLEANER: fileType is neither building or index! it is: " + fileType);
                    throw("ERROR IN TCLEANER: fileType is neither building or index! it is: " + fileType);
                }
            }
            else {
                // console.log("skipped item from tCleaner, with nodeName: " + subTbody["nodeName"]);
            }
        }
        return neededJSONs;
    }

    tCleanerHelper(subTbody: any): void {    // returns what we need!
        let that = this;
        // right now, we should be in tbody -> tr.

        // what we need to do is to extract relevant info to us via if-statements,
        // and finally call out to tFolderHelper to grab additional information from
        // the file from the folder.

        // I think I will decide what to do with the latlon on a later time...
        // although it'll probably end up here anyhow.

        // begin!
        // console.log("inside tCleanerHelper");
        let childNodes = subTbody["childNodes"];
        let jsonObject:any = new Object();
        // from structure of one tr item, I see that we have 4 grab-able items
        /*
         * <td class="views-field views-field-field-building-code" >    <- gives us building code
         * <td class="views-field views-field-title" > <a>              <- gives us building title, within "a" link.
         * <td class="views-field views-field-field-building-address" > <- gives us building address
         * <td class="views-field views-field-nothing" > <a href="./campus/discover/buildings-and-classrooms/ACU">
         *     ^^ stylistic choice. I will be grabbing the link to buildings from here... if needed. I'll just put it as a field for now.
         */
        // further note: href is not defined here. will comment it out

        for (let item of childNodes) {
            // here we should see alternation of #text and td, and we only want td values
            if (item["nodeName"] === "td") {
                if (item["attrs"][0]["name"] === "class") {
                    if (item["attrs"][0]["value"] === "views-field views-field-field-building-code") {
                        // here we see that we are in the building-code field. its child node should give what we desire.
                        let stringValue = item["childNodes"][0]["value"];
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        jsonObject["rooms_shortname"] = stringValue;
                    }
                    else if (item["attrs"][0]["value"] === "views-field views-field-title") {
                        // here we see that we are in the building-code field. accessing several fields would get us
                        let stringValue = item["childNodes"][1]["childNodes"][0]["value"];
                        // let stringValue = item["childNodes"]["a"]["childNodes"]["#text"]["value"];
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        jsonObject["rooms_fullname"] = stringValue;
                    }
                    else if (item["attrs"][0]["value"] === "views-field views-field-field-building-address") {
                        // here we see that we are in the building-code field. its child node should give what we desire.
                        let stringValue = item["childNodes"][0]["value"];
                        // let stringValue = item["childNodes"]["#text"]["value"];
                        // assert(stringValue is a string)
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        // console.log("building address after trimming: " + stringValue);
                        jsonObject["rooms_address"] = stringValue;
                    }
                    // I don't think any other case interests us... so let's leave it at that.

                }
            }
        }
        // now we push it onto our list of objects
        // that.dataset.push(jsonObject);
        return jsonObject;
    }


    tCleanerHelperRoom(subTbody: any): void {    // returns what we need!
        let that = this;
        // right now, we should be in tbody -> tr.

        // see above for heavy commenting
        // purpose: extract info on seating and such. Initialize variables, so that we can detect errors later if needed

        // begin!
        // console.log("inside tCleanerHelperRoom");
        let childNodes = subTbody["childNodes"];
        let jsonObject:any = new Object();
        // from structure of one tr item, I see that we have 4 grab-able items
        /*
         * <td class="views-field views-field-field-room-number" > <a>  <- gives us room number in childNodes->#text, and href link within "a"
         * <td class="views-field views-field-field-room-capacity" >    <- gives us room capacity
         * <td class="views-field views-field-field-room-furniture" >   <- gives us room furniture
         * <td class="views-field views-field-field-room-type" >        <- fives us room type
         */
        /*
                rooms_fullname: string; Full building name (e.g., "Hugh Dempster Pavilion").
                rooms_shortname: string; Short building name (e.g., "DMP").
                rooms_number: string; The room number. Not always a number, so represented as a string.
                rooms_name: string; The room id; should be rooms_shortname+"_"+rooms_number.
                rooms_address: string; The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
                rooms_lat: number; The latitude of the building. Instructions for getting this field are below.
                rooms_lon: number; The longitude of the building. Instructions for getting this field are below.
                rooms_seats: number; The number of seats in the room.
                rooms_type: string; The room type (e.g., "Small Group").
                rooms_furniture: string; The room type (e.g., "Classroom-Movable Tables & Chairs").
                rooms_href: string; The link to full details online
                            (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").
                    */
        // initialize all types, so that they're always in a good order. Also makes checking for missing fields later on
        // where we just check for fields that are still in initialized form
        jsonObject["rooms_fullname"] = "undefined";
        jsonObject["rooms_shortname"] = "undefined";
        jsonObject["rooms_number"] = "undefined";
        jsonObject["rooms_name"] = "undefined";
        jsonObject["rooms_address"] = "undefined";
        jsonObject["rooms_lat"] = -1;
        jsonObject["rooms_lon"] = -1;
        jsonObject["rooms_seats"] = -1;
        jsonObject["rooms_type"] = "undefined";
        jsonObject["rooms_furniture"] = "undefined";
        jsonObject["rooms_href"] = "undefined";

        for (let item of childNodes) {
            // here we should see alternation of #text and td, and we only want td values
            if (item["nodeName"] === "td") {
                if (item["attrs"][0]["name"] === "class") {
                    if (item["attrs"][0]["value"] === "views-field views-field-field-room-number") {
                        // here we see that we are in the building-code field. its child node should give what we desire.
                        let stringValue = item["childNodes"][1]["childNodes"][0]["value"];      // hard-coded value
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        jsonObject["rooms_number"] = stringValue;
                        // let's get URL too
                        let attributesList = item["childNodes"][1]["attrs"];
                        // let attributesList = item["childNodes"]["a"]["attrs"];
                        let urlLinkValue = "";
                        for (let attribute of attributesList) {
                            if (attribute["name"] === "href") {
                                urlLinkValue = attribute["value"];
                            }
                        }
                        // console.log("urlLinkValue value before trim: " + urlLinkValue);
                        urlLinkValue = urlLinkValue.trim();   // removes whitespace and newline characters
                        jsonObject["rooms_href"] = urlLinkValue;
                    }
                    else if (item["attrs"][0]["value"] === "views-field views-field-field-room-capacity") {
                        // here we see that we are in the building-code field. accessing several fields would get us
                        let stringValue = item["childNodes"][0]["value"];
                        // let stringValue = item["childNodes"]["a"]["childNodes"]["#text"]["value"];
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        let intValue = Number(stringValue); // converts string to int
                        jsonObject["rooms_seats"] = intValue;


                    }
                    else if (item["attrs"][0]["value"] === "views-field views-field-field-room-furniture") {
                        // here we see that we are in the building-code field. its child node should give what we desire.
                        let stringValue = item["childNodes"][0]["value"];
                        // let stringValue = item["childNodes"]["#text"]["value"];
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        // console.log("building address after trimming: " + stringValue);
                        jsonObject["rooms_furniture"] = stringValue;
                    }
                    else if (item["attrs"][0]["value"] === "views-field views-field-field-room-type") {
                        // here we see that we are in the building-code field. its child node should give what we desire.
                        let stringValue = item["childNodes"][0]["value"];
                        // let stringValue = item["childNodes"]["#text"]["value"];
                        stringValue = stringValue.trim();   // removes whitespace and newline characters
                        // console.log("building address after trimming: " + stringValue);
                        jsonObject["rooms_type"] = stringValue;
                    }
                    // I don't think any other case interests us... so let's leave it at that.

                }
            }
        }

        // now we push it onto our list of objects
        // that.dataset.push(jsonObject);
        return jsonObject;
    }



    roomOperator(roomObject: any) {
        // operates on objects!
        // roomObject["name"] is the name of the file
        // roomObject["content"] is the thing we get right after parse5
        // console.log("in roomOperator");
        let that = this;
        // console.log("definition of \"that\" in roomOperator: " + that);
        let currentPath = roomObject["name"];
        if (currentPath.includes("DS_Store")) {
            //console.log("skip element with name: " + currentPath);
            // return null;     <-- cannot have null, as there is no .length for it! so we need empty array
            return [];
        }
        let contents = roomObject["content"]; // equivalent to parse5.parse(decompressedFile);

        for (let singleBuilding of that.buildingsOfUBC) {   // searcher!
            // do stuff
            var roomsOfBuilding;
            if (currentPath.includes(singleBuilding["rooms_shortname"])) {
                // extract page info via a function, eg getInfo(currentPath)
                // have list of rooms from the building, then for each room, we fill in the
                // appropriate blank.
                var document = contents;        // equivalent to parse5.parse(decompressedFile);
                // share the traverser, as we are only looking for tbody here
                var tBodyObject = that.traverser(document);
                // next step: clean the rooms as we can. We may need to watch out for undefined cases.
                if (tBodyObject === null || tBodyObject === undefined) {
                    // fixed the undefined issue! If there's no tbody, just skip the building.
                    //console.log("there was no tbody found by the traverser!")
                    return;
                    // TODO: this might cause errors. Check if some smaller loop-breaker value may fit better!
                }
                // now clean the rooms!
                roomsOfBuilding = that.tCleaner(tBodyObject, "building");
                if (roomsOfBuilding.length === 0) {
                    // console.log(currentPath + " does not have any rooms!");
                }
                for (var room of roomsOfBuilding) {
                    // input missing fields from index, after the majority of object is parsed
                    room["rooms_shortname"] = singleBuilding["rooms_shortname"];
                    room["rooms_fullname"] = singleBuilding["rooms_fullname"];
                    room["rooms_address"] = singleBuilding["rooms_address"];
                    // now! check to see if room has both the rooms_shortname and rooms_number fields to create rooms_name
                    if ((room["rooms_shortname"] !== undefined) && (room["rooms_number"] !== -1)) {
                        room["rooms_name"] = room["rooms_shortname"] + "_" + room["rooms_number"];
                    }
                    else {
                        // console.log("we don't have rooms_shortname or rooms_number!");
                        throw("we don't have rooms_shortname or rooms_number!");
                    }
                }
                // return roomsOfBuilding;
            }
        }
        if (typeof roomsOfBuilding === "undefined") {
            //console.log(currentPath + " does is not part of buildings!");
            return [];
        }
        return roomsOfBuilding;
    }




    removeNullAndMakeOneBigListOfCourses(arrjson:Array<any>) {
        var arraycourses:Array<any> = [];
        var listcourses:Array<any> = [];
        for (let i = 0; i < arrjson.length; i++) {

            if (arrjson[i] != null) {
                listcourses = arrjson[i]["result"];
                for(let j=0; j < listcourses.length; j++){
                    listcourses[j]["id"] = String(listcourses[j]["id"])
                    arraycourses.push(listcourses[j])
                }
                //array.push(arrjson[i]["result"])
                //console.log(arrjson[i]["result"])
            }
            // else {array.concat(arrjson[i])}
        }
        //console.log(arraycourses)
        //arrjson = array
        //arrjson = array ;
        return arraycourses;

    }





    outputDataSetToDisk(id:string, addeddataset:any){
        var stringdataset = JSON.stringify(addeddataset);
        fs.writeFile( id, stringdataset,(err:string) => {
            //console.log(err)
        })

    }


    removeDataset(id: string): Promise<InsightResponse> {


        var that = this;
        // console.log(that.dataset);
        return new Promise(function (fulfill, reject) {
            if (that.dataset.hasOwnProperty(id)){
                delete that.dataset[id];
                // console.log(that.dataset[id])
                fs.unlink(id)
                fulfill({
                    "code": 204, "body": {"success": "the operation was successful"}
                })
            }
            else {reject({
                "code": 404, "body": {"success": "the operation was unsuccessful because the delete was for a resource that was not previosuly added"}
            })}
            // console.log(that.dataset)

        })
    }



    performQuery(query: any): Promise <InsightResponse> {
        var that = this;
        //var datasetlist = that.dataset["courses"];
        // var responses:Array<Object> = [];
        // console.log(datasetlist)

        return new Promise(function (fulfill,reject) {

            //that.checkValidQuery(query)
            // /*
            if (that.dataset.hasOwnProperty("courses")|| that.dataset.hasOwnProperty("rooms")){

                try {
                    if (that.checkValidQuery(query)!== true) {
                        that.queryType = "undefined";
                        reject({
                            "code": 400, "body": { "error": "Query is invalid query. Trace path: performQuery->checkValidQuery->query not valid" }
                        });
                        return;         // should we do this step?
                    }
                } catch(err) {
                    console.log("caught error in checkValidQuery!");
                    console.log("error before handling: " + err);
                    // console.log("preparing to reject with 400 response.");
                    // throw("stuff");
                    that.queryType = "undefined";
                    reject({
                        "code": 400, "body": { "error": "Query is invalid query. Trace path: performQuery->checkValidQuery->error thrown in cVQ()." }
                    });
                    return;
                    // return false
                }

                // now we perform the WHERE part
                // console.log(query["WHERE"]);
                // console.log(query["OPTIONS"])
                var filter = query["WHERE"];
                var columns = query["OPTIONS"];
                var transformations = query["TRANSFORMATIONS"];
                // console.log(that.dataset);
                // console.log(Object.keys(filter).length);
                //  console.log(that.queryType);
                //console.log(that.dataset);

                /**
                 * mComparison, sComparison, negation, and logic all return a processed array, so we can use recursion to do all possible combination
                 * below it is my proudest creation.
                 * **/



                if (that.dataset.hasOwnProperty(that.queryType)) {

                    var response:Array<any> = [];
                    var parsedDataset = [];
                    if (Object.keys(filter).length !== 0) {
                        parsedDataset = that.supermanFilterRecursion(filter);
                    }
                    else {
                        parsedDataset = that.dataset[that.queryType]
                    }
                    //console.log(parsedDataset);
                    if(parsedDataset.length == 0){
                        fulfill({
                            "code": 200, "body": {result:[]}
                        });
                        return;
                    }

                    if (typeof transformations !== "undefined"){


                        if(that.queryType === "courses") {parsedDataset = that.helperToChangeCoursesResult(parsedDataset);
                            var transformresult = that.transformationsHelper(transformations, parsedDataset);
                        }
                        else {
                            var transformresult = that.transformationsHelper(transformations, parsedDataset);
                            // console.log(transformresult);
                        };

                        //console.log(transformresult);
                        response = that.optionsFunction(columns, transformresult, "d3");
                        //console.log(column)
                    }
                    else {

                        response = that.optionsFunction(columns, parsedDataset, "legacy");
                    }
                    //console.log(response);

                    that.queryType = "undefined";
                    fulfill({
                        "code": 200, "body": response
                    });
                }


                else {
                    that.queryType = "undefined";
                    reject({
                        "code": 424, "body": {"error": "Required Dataset is missing. Trace path: performQuery->checkValidQuery->query valid->no database. #1"}
                    })}
            }


            else {
                that.queryType = "undefined";
                reject({
                    "code": 424, "body": {"error": "Required Dataset is missing. Trace path: performQuery->checkValidQuery->query valid->no database. #2"}
                })} });
    }

    helperToChangeCoursesResult(parsedDataset:Array<any>){
        var arraytochangecoursesfields = [];
        for (let onejson of parsedDataset){
            var jsonstr = JSON.stringify(onejson);
            var new_jsonstr = jsonstr.replace('"Title"', '"courses_title"');
            new_jsonstr = new_jsonstr.replace('"Subject"', '"courses_dept"');
            new_jsonstr = new_jsonstr.replace('"Course"', '"courses_id"');
            new_jsonstr = new_jsonstr.replace('"Avg"', '"courses_avg"');
            new_jsonstr = new_jsonstr.replace('"Professor"', '"courses_instructor"');
            new_jsonstr = new_jsonstr.replace('"Pass"', '"courses_pass"');
            new_jsonstr = new_jsonstr.replace('"Fail"', '"courses_fail"');
            new_jsonstr = new_jsonstr.replace('"Audit"', '"courses_audit"');
            new_jsonstr = new_jsonstr.replace('"id"', '"courses_uuid"');
            new_jsonstr = new_jsonstr.replace('"Year"', '"courses_year"');

            var new_obj = JSON.parse(new_jsonstr)
            arraytochangecoursesfields.push(new_obj);
        }
        return arraytochangecoursesfields;
    };


    transformationsHelper(transformations:any, parsedDataset:Array<any>){
        var that = this;
        var group = transformations['GROUP'];
        var listofapplykey = transformations['APPLY'];
        that.countgroupnumnberkey = group.length;
        //console.log(parsedDataset);


        //  console.log(listofapplykey);

        var listresults = parsedDataset;
        //console.log(listresults);


        var setofgroupresult = that.groupHelper(group, listresults);
        if (listofapplykey.length == 0){
            return setofgroupresult;
        }
        // console.log(setofgroupresult);
        // console.log(parsedDataset)
        //var arraytoholdalltransformations = [];


        for (let applykey of listofapplykey ){
            var transformationresult = that.applyHelper(applykey,setofgroupresult, parsedDataset);
        }
        // console.log(setofgroupresult);
        // console.log(transformationresult);

        return transformationresult;
    }

    applyHelper(applykey:Array<any>, setofgroupresult:Array<any>, parsedDataset:Array<any>){
        var that = this;
        var string:any  = Object.keys(applykey)[0];
        var temp = applykey[string];
        var applytoken = Object.keys(temp)[0];
        var key = temp[applytoken];


        switch(applytoken) {
            case "MAX":
                // return null;
                return that.tokenMAX(setofgroupresult,parsedDataset,key,string);

            case "MIN":
                return that.tokenMIN(setofgroupresult,parsedDataset,key,string);

            case "AVG":
                return that.tokenAVG(setofgroupresult,parsedDataset,key,string);

            case "SUM":
                return that.tokenSUM(setofgroupresult,parsedDataset,key,string);

            case "COUNT":
                return that.tokenCOUNT(setofgroupresult,parsedDataset,key,string);
            default:
                var text = "I have never heard such token";
        }



    }

    tokenCOUNT(setofgroupresult:Array<any>, parsedDataset:Array<any>, key:string, string:string){
        var that =this;
        var groupkeys:Array<any> = [];
        for (let o =0 ; o < that.countgroupnumnberkey; o++){
            groupkeys.push(Object.keys(setofgroupresult[0])[o]);
        }
        var arraytoholdglistvalues:any = that.helperForGettinggArrayForVerification(setofgroupresult,groupkeys);
        var arraytoholdwlistvalues:any = that.helperForGettingwArrayForVerification(parsedDataset, groupkeys);

        if(arraytoholdwlistvalues.length === arraytoholdglistvalues.length){
            for (let i =0; i < arraytoholdwlistvalues.length; i++){
                setofgroupresult[i][string] = 1;
            }

            return setofgroupresult;
        }

        for (let i:number =0; i < setofgroupresult.length ;i++){
            var arraytoarraykeyvalue:Array<any> = [];
            for(let j:number=0; j < parsedDataset.length; j++){

                if (arraytoholdglistvalues[i] === arraytoholdwlistvalues[j]){
                    arraytoarraykeyvalue.push(parsedDataset[j][key]);
                }
            }

            var arrayofnoduplicateuniquekey = Array.from(new Set(arraytoarraykeyvalue));
            var countunique = arrayofnoduplicateuniquekey.length;
            setofgroupresult[i][string] = countunique;

        }

        return setofgroupresult;
        //i[string] = Math.round((sumallnumber/countnumberadded)*100)/100;
    };



    tokenSUM(setofgroupresult:Array<any>, parsedDataset:Array<any>, key:string, string:string){
        let Decimal = require('decimal.js');
        var that =this;
        var groupkeys:Array<any> = [];
        for (let o =0 ; o < that.countgroupnumnberkey; o++){
            groupkeys.push(Object.keys(setofgroupresult[0])[o]);
        }

        var arraytoholdglistvalues:any = that.helperForGettinggArrayForVerification(setofgroupresult,groupkeys);
        var arraytoholdwlistvalues:any = that.helperForGettingwArrayForVerification(parsedDataset, groupkeys);
        if(arraytoholdwlistvalues.length === arraytoholdglistvalues.length){
            for (let i =0; i < arraytoholdwlistvalues.length; i++){
                setofgroupresult[i][string] = parsedDataset[i][key];
            }

            return setofgroupresult;
        }


        for (let i:number =0; i < setofgroupresult.length ;i++){
            var sumarray = [];
            for(let j:number=0; j < parsedDataset.length; j++){

                if (arraytoholdglistvalues[i] === arraytoholdwlistvalues[j]){
                    sumarray.push(parsedDataset[j][key]);
                }
            }

            let sum = Number(sumarray.map(val => new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber().toFixed(2));
            setofgroupresult[i][string] = sum;

        }

        return setofgroupresult;
    };

    tokenAVG(setofgroupresult:Array<any>, parsedDataset:Array<any>, key:string, string:string){
        var that =this;
        var groupkeys:Array<any> = [];
        for (let o =0 ; o < that.countgroupnumnberkey; o++){
            groupkeys.push(Object.keys(setofgroupresult[0])[o]);
        }

        var arraytoholdglistvalues:any = that.helperForGettinggArrayForVerification(setofgroupresult,groupkeys);
        var arraytoholdwlistvalues:any = that.helperForGettingwArrayForVerification(parsedDataset, groupkeys);

       if(arraytoholdwlistvalues.length === arraytoholdglistvalues.length){
           for (let i =0; i < arraytoholdwlistvalues.length; i++){
               setofgroupresult[i][string] = parsedDataset[i][key];
           }

           return setofgroupresult;
       }


        for (let i:number =0; i < setofgroupresult.length ;i++){
            var arrayofnumbertoaverage = [];
            var divider:number = 0;
            for(let j:number=0; j < parsedDataset.length; j++){

                if (arraytoholdglistvalues[i] === arraytoholdwlistvalues[j]){
                    arrayofnumbertoaverage.push(parsedDataset[j][key]);
                }
            }
            let Decimal = require('decimal.js');
            let avg: number = Number((arrayofnumbertoaverage.map(val => <any>new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber() / arrayofnumbertoaverage.length).toFixed(2));


            setofgroupresult[i][string] = avg;

        }

        return setofgroupresult;
        //i[string] = Math.round((sumallnumber/countnumberadded)*100)/100;

    };

    tokenMIN(setofgroupresult:Array<any>, parsedDataset:Array<any>, key:string, string:string){
        var that =this;
        var groupkeys:Array<any> = [];
        for (let o =0 ; o < that.countgroupnumnberkey; o++){
            groupkeys.push(Object.keys(setofgroupresult[0])[o]);
        }

        var arraytoholdglistvalues:any = that.helperForGettinggArrayForVerification(setofgroupresult,groupkeys);
        var arraytoholdwlistvalues:any = that.helperForGettingwArrayForVerification(parsedDataset, groupkeys);
        if(arraytoholdwlistvalues.length === arraytoholdglistvalues.length){
            for (let i =0; i < arraytoholdwlistvalues.length; i++){
                setofgroupresult[i][string] = parsedDataset[i][key];
            }

            return setofgroupresult;
        }


        for (let i:number =0; i < setofgroupresult.length ;i++){
            var holdmax:Array<number> = [];
            for(let j:number=0; j < parsedDataset.length; j++){

                if (arraytoholdglistvalues[i] === arraytoholdwlistvalues[j]){
                    holdmax.push(parsedDataset[j][key]);
                }

                var count = 0;
                var max = 0;
                //console.log(j);
            }

            var min = holdmax.reduce(function(a, b) {
                return Math.min(a, b);
            });

            setofgroupresult[i][string] = min;

        }

        return setofgroupresult;

    };



    tokenMAX(setofgroupresult:Array<any>, parsedDataset:Array<any>, key:string, string:string){
        var that =this;
        var groupkeys:Array<any> = [];
        for (let o =0 ; o < that.countgroupnumnberkey; o++){
            groupkeys.push(Object.keys(setofgroupresult[0])[o]);
        }


        var arraytoholdglistvalues:any = that.helperForGettinggArrayForVerification(setofgroupresult,groupkeys);
        var arraytoholdwlistvalues:any = that.helperForGettingwArrayForVerification(parsedDataset, groupkeys);

        if(arraytoholdwlistvalues.length === arraytoholdglistvalues.length){
            for (let i =0; i < arraytoholdwlistvalues.length; i++){
                setofgroupresult[i][string] = parsedDataset[i][key];
            }

            return setofgroupresult;
        }

        for (let i:number =0; i < setofgroupresult.length ;i++){
            var holdmax:Array<number> = [];
            for(let j:number=0; j < parsedDataset.length; j++){

                if (arraytoholdglistvalues[i] === arraytoholdwlistvalues[j]){
                    holdmax.push(parsedDataset[j][key]);
                }

                var count = 0;
                var max = 0;
                //console.log(j);
            }

            var max = holdmax.reduce(function(a, b) {
                return Math.max(a, b);
            });

            setofgroupresult[i][string] = max;

        }

        return setofgroupresult;
    }

    helperForGettinggArrayForVerification(setofgroupresult:Array<any>,groupkeys:Array<any>){
        var arraytoholdglistvalues = [];
        for(let setjson of setofgroupresult) {
            //console.log(setjson);
            var onestring:string ="";
            for(let key of groupkeys){
                //console.log(key);
                onestring = onestring + String(setjson[key]);
            }
            arraytoholdglistvalues.push(onestring);
        }
        return arraytoholdglistvalues;

    }
    helperForGettingwArrayForVerification( parsedDataset:Array<any>,groupkeys:Array<any>){
        var arraytoholdwlistvalues = [];
        for (let wherejson of parsedDataset){
            var onestring:string ="";
            for(let key of groupkeys){
                //console.log(key);
                onestring = onestring + String(wherejson[key]);
            }
            arraytoholdwlistvalues.push(onestring);
        }
        return arraytoholdwlistvalues;
    }

    groupHelper(group:Array<any>, listresults:Array<any>){

        // var filtered =Object.keys(listresults[0]).filter(function(e){return this.indexOf(e)<0;},group);
        //console.log(filtered);
        var temparry = [];
        for (let roomobject of listresults){
            var onejson:any = {};
            for (let key of group){
                //console.log(key)
                onejson[key] = roomobject[key];
            }
            temparry.push(onejson);
        }
        //console.log(temparry);
        var holdjsons = [];
        for (let i in temparry){
            holdjsons.push(JSON.stringify(temparry[i]));

        }
        var array = Array.from(new Set(holdjsons));
        //console.log(array);
        var finalgroup = [];
        for (let string of array ){
            finalgroup.push(JSON.parse(string));
        }

        return finalgroup;
    }


    supermanFilterRecursion(filter:any) {
        var that = this;
        // console.log(filter);
        //  for (var i = 0; i < Object.keys(filter).length; i++){
        var wholefilter = Object.keys(filter);
        var filterkey = wholefilter[0];         // it is at index key 0 only before there can only be one key in filter and the only key must be in index 0
        // console.log(filterkey);
        if (filterkey === "GT" || filterkey === "EQ" || filterkey === "LT") {
            return that.mComparison(filterkey, filter);
        }

        if (filterkey === "IS") {
            return that.sComparison(filter);
        }

        if (filterkey === "AND") {
            return that.lAndComparison(filterkey,filter);

        }

        if (filterkey === "OR"){
            return that.lORComparison(filterkey,filter);
        }

        if (filterkey === "NOT") {
            return that.negationNOT(filter);
        }
        //}

    }

    negationNOT(filter:any){
        var that = this;
        //console.log(that.queryType);
        var processedarray:Array<any> = that.supermanFilterRecursion(filter["NOT"]);
        var sprocessedarray:Array<any> = [];
        // console.log(processedarray);
        if (that.queryType === 'courses') {
            return that.negationNotHelper(processedarray, "courses");
        }
        else if (that.queryType === 'rooms') {
            return that.negationNotHelper(processedarray, "rooms");
        }

    }

    negationNotHelper(processedarray:Array<any>, id:string){
        var that = this;
        var sprocessedarray:Array<any> = [];
        for (let i = 0; i<processedarray.length; i++){
            var sjson = JSON.stringify(processedarray[i]);
            sprocessedarray.push(sjson);

        }

        var swholearray = [];
        for(let j = 0; j<that.dataset[id].length;j++) {
            var gjson = JSON.stringify(that.dataset[id][j]);
            swholearray.push(gjson);

        }

        var res  = swholearray.filter(function(n){
            return !this.has(n)}, new Set(sprocessedarray));

        var notarray:Array<any> = [];

        for (let x=0; x < res.length; x++){
            var onejson = JSON.parse(res[x]);
            notarray.push(onejson);
        }

        return notarray;
    };

    lAndComparison(filterkey:string, filter:any){
        var that = this;
        if (filterkey === "AND") {
            //console.log(filter["AND"]);
            var filterarray = filter["AND"];
            // console.log(filterarray);
            var temparray:Array<any> = [];

            for (let eachfilter of filterarray) {
                temparray.push(that.supermanFilterRecursion(eachfilter));
            }
            // console.log(temparray);

            var arrayofarrays:Array<Array<any>> =[];
            for (let eachlist of temparray){
                var sarray = [];
                for(let onejson of eachlist){
                    var turnsjson = JSON.stringify(onejson);
                    sarray.push(turnsjson);
                }
                arrayofarrays.push(sarray);
            }



            var res = arrayofarrays[0];
            //console.log(res.length)
            // console.log(arrayofarrays);



            //console.log(arrayofarrays.length);
            for (let g=1; g < arrayofarrays.length  ;g++){
                res = res.filter(function(n){return this.has(n)}, new Set(arrayofarrays[g]))
                // console.log(res.length)
            }


            var finalarray:Array<any> =[];
            for (let f=0; f < res.length;f++){
                var jjson = JSON.parse(res[f]);
                finalarray.push(jjson);
            }

            return finalarray;
        }
    }


    lORComparison(filterkey:string, filter:any) {
        var that = this;
        if (filterkey === "OR") {
            //console.log(filter["OR"]);
            var filterarray = filter["OR"];
            var temparray:Array<any> = [];
            for (let eachfilter of filterarray) {
                temparray = temparray.concat(that.supermanFilterRecursion(eachfilter));

            }


            var emptyarray = [];
            for (let i = 0; i < temparray.length; i++) {
                var onestring = JSON.stringify(temparray[i]);
                emptyarray.push(onestring);
            }
            //console.log(that.orunprocessedarray);
            // that.orunprocessedarray = [];
            var resultset = new Set(emptyarray);
            var array = Array.from(resultset);
            var result: Array<any> = [];
            for (let j = 0; j < array.length; j++) {
                var backjson = JSON.parse(array[j]);
                result.push(backjson);
            }

            return result;
        }

    }



    mComparison(filterkey:string, filter:Object) {
        var that = this;
        //var alljsonsofthecorrespondingzip = that.dataset["courses"];
        // console.log(alljsonsofthecorrespondingzip);
        if (filterkey === "GT"|| filterkey === "EQ" || filterkey ==="LT" || filterkey === "IS") {
            if (filterkey === "GT") {
                //console.log(Object.keys(levelwhere)[i])
                return that.greaterThan(filter);
            }
            else if (filterkey === "EQ") {
                return that.equalTo(filter);
            }

            else if (filterkey === "LT") {
                return that.lowerThan(filter);
            }
        }

    }



    equalTo(filter:any){
        var that=this;
        var trollarray = [];
        var datasetlist = that.dataset["courses"];
        var datarooms = that.dataset['rooms'];
        var mkey = filter["EQ"];
        //var mkeyvalue = mkey["courses_audit"]
        // console.log(datasetlist)

        if(typeof mkey["courses_avg"] != "undefined"){
            for (let oneitem of datasetlist){
                if(mkey["courses_avg"] === oneitem["Avg"]){
                    // console.log(oneitem["Avg"]) <------ possible super long statement
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_pass"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_pass"] === oneitem["Pass"]){
                    // console.log(oneitem["Pass"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);

            }
        }
        else if(typeof mkey["courses_fail"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Fail"])
                if(mkey["courses_fail"] === oneitem["Fail"]){
                    // console.log(oneitem["Fail"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_audit"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_audit"] === oneitem["Audit"]){
                    // console.log(oneitem["Audit"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["courses_year"] !== "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_year"] === oneitem["Year"]){
                    // console.log(oneitem["Audit"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_lat"] !== "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_lat"] === oneitem["rooms_lat"]){
                    // console.log(oneitem["Audit"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_lon"] !== "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_lon"] === oneitem["rooms_lon"]){
                    // console.log(oneitem["Audit"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_seats"] !== "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_seats"] === oneitem["rooms_seats"]){
                    // console.log(oneitem["Audit"])
                    trollarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }




        //console.log(trollarray);
        return trollarray;


    }

    lowerThan(filter:any){
        var that=this;
        var lowerthanarray = [];
        var datasetlist = that.dataset["courses"];
        var datarooms = that.dataset['rooms'];
        var mkey = filter["LT"];
        //var mkeyvalue = mkey["courses_audit"]
        //console.log(mkeyvalue)

        if(typeof mkey["courses_avg"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_avg"] > oneitem["Avg"]){
                    // console.log(oneitem["Avg"])
                    lowerthanarray.push(oneitem)
                }
                // console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_pass"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_pass"] > oneitem["Pass"]){
                    // console.log(oneitem["Pass"])
                    lowerthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);

            }
        }
        else if(typeof mkey["courses_fail"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Fail"])
                if(mkey["courses_fail"] > oneitem["Fail"]){
                    // console.log(oneitem["Fail"])
                    lowerthanarray.push(oneitem)
                }
                // console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_audit"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_audit"] > oneitem["Audit"]){
                    // console.log(oneitem["Audit"])
                    lowerthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["courses_year"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_year"] > oneitem["Year"]){
                    // console.log(oneitem["Audit"])
                    lowerthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_lat"] != "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_lat"] > oneitem["rooms_lat"]){
                    // console.log(oneitem["Audit"])
                    lowerthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_lon"] != "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_lon"] > oneitem["rooms_lon"]){
                    // console.log(oneitem["Audit"])
                    lowerthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_seats"] != "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_seats"] > oneitem["rooms_seats"]){
                    // console.log(oneitem["Audit"])
                    lowerthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        //console.log(lowerthanarray);
        return lowerthanarray;
    }

    greaterThan(mcomparatorkeyandvaluestring:any){
        var that=this;
        var greaterthanarray = [];
        var datasetlist:Array<any> = that.dataset["courses"];
        var datarooms:Array<any> = that.dataset["rooms"];
        //console.log(that.dataset["rooms"]);
        var mkey = mcomparatorkeyandvaluestring["GT"];
        //var mkeyvalue = mkey["courses_audit"]
        // console.log(mkey)

        if(typeof mkey["courses_avg"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_avg"] < oneitem["Avg"]){
                    // console.log(oneitem["Avg"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_pass"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_pass"] < oneitem["Pass"]){
                    // console.log(oneitem["Pass"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);

            }
        }
        else if(typeof mkey["courses_fail"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Fail"])
                if(mkey["courses_fail"] < oneitem["Fail"]){
                    // console.log(oneitem["Fail"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_audit"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_audit"] < oneitem["Audit"]){
                    // console.log(oneitem["Audit"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["courses_year"] != "undefined"){
            for (let oneitem of datasetlist){
                // console.log(oneitem["Avg"])
                if(mkey["courses_year"] < oneitem["Year"]){
                    // console.log(oneitem["Audit"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }
        else if(typeof mkey["rooms_lat"] != "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_lat"] < oneitem["rooms_lat"]){
                    // console.log(oneitem["Audit"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_lon"] != "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_lon"] < oneitem["rooms_lon"]){
                    // console.log(oneitem["Audit"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        else if(typeof mkey["rooms_seats"] != "undefined"){
            for (let oneitem of datarooms){
                //console.log(mkey["courses_year"])

                if(mkey["rooms_seats"] < oneitem["rooms_seats"]){
                    // console.log(oneitem["Audit"])
                    greaterthanarray.push(oneitem)
                }
                //console.log(oneitem["Avg"]);
            }
        }

        //console.log(greaterthanarray);
        return greaterthanarray;


    }
    //


    sComparison(filter:any){
        var that=this;
        var skey = filter["IS"];
        var scomparisonarray = [];
        var datasetlist = that.dataset["courses"];
        var datarooms = that.dataset['rooms'];


        if(typeof skey["courses_dept"] != "undefined"){
            for (let eachsection of datasetlist ){
                if(that.checkInputString(eachsection["Subject"], skey["courses_dept"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }

        if(typeof skey["courses_title"] != "undefined"){
            for (let eachsection of datasetlist ){
                if(that.checkInputString(eachsection["Title"], skey["courses_title"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Title"])
                }
            }
            // console.log(that.queryarray);

        }
        if(typeof skey["courses_id"] != "undefined"){
            for (let eachsection of datasetlist ){
                if(that.checkInputString(eachsection["Course"], skey["courses_id"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Course"])
                }
            }
            // console.log(that.queryarray);

        }
        if(typeof skey["courses_instructor"] != "undefined"){
            for (let eachsection of datasetlist ){
                if(that.checkInputString(eachsection["Professor"], skey["courses_instructor"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Professor"]);
                }
            }
            //   console.log(that.queryarray);

        }
        if(typeof skey["courses_uuid"] != "undefined") {
            for (let eachsection of datasetlist) {
                if (that.checkInputString(eachsection["id"], skey["courses_uuid"])) {

                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["id"]);
                }
            }

        }


        if(typeof skey["rooms_fullname"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_fullname"], skey["rooms_fullname"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }

        if(typeof skey["rooms_shortname"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_shortname"], skey["rooms_shortname"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }
        if(typeof skey["rooms_number"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_number"], skey["rooms_number"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }
        if(typeof skey["rooms_name"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_name"], skey["rooms_name"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }

        if(typeof skey["rooms_address"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_address"], skey["rooms_address"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }

        if(typeof skey["rooms_type"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_type"], skey["rooms_type"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }

        if(typeof skey["rooms_furniture"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_furniture"], skey["rooms_furniture"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }

        if(typeof skey["rooms_href"] != "undefined"){
            for (let eachsection of datarooms ){
                if(that.checkInputString(eachsection["rooms_href"], skey["rooms_href"]))
                {
                    scomparisonarray.push(eachsection);
                    // console.log(eachsection["Subject"])
                }
            }
            //console.log(that.queryarray);
        }



        return scomparisonarray;

    }

    checkInputString(datasetvalue:string, givenvalue:string){
        if (datasetvalue===givenvalue){
            // console.log("gg")                <------------------it's super long
            return true;
        }
        //console.log(givenvalue.charAt(0))
        else if(datasetvalue.startsWith(givenvalue.replace(/\*/g,""))&& givenvalue.charAt(givenvalue.length-1)==="*" && givenvalue.charAt(0)!=="*"){
            // console.log("fuddle duddle");
            return true;
        }
        else if (datasetvalue.endsWith(givenvalue.replace(/\*/g,"")) && givenvalue.charAt(0)==="*" && givenvalue.charAt(givenvalue.length-1)!=="*" ){
            //console.log("fuddle duddle 2");
            return true;
        }
        else if (datasetvalue.includes(givenvalue.replace(/\*/g,""))&&givenvalue.charAt(givenvalue.length-1)==="*"&& givenvalue.charAt(0)==="*"){
            //console.log("fuddle duddle 3");
            return true;
        }
    }

    globalVarClearer() {
        this.queryType = "undefined";
        this.applyKeyStringArray = [];
        this.groupArray = [];
    }

    checkValidQuery(query:any){
        var that = this;


        if(query.hasOwnProperty('WHERE') && query.hasOwnProperty('OPTIONS')) {
            //console.log("the query is valid on top layer");
            console.log("value of applyKeyString before resetting: ");
            console.log(that.applyKeyStringArray);
            that.globalVarClearer();
            that.applyKeyStringArray = [];
            that.groupArray = [];
            console.log("value of applyKeyString after resetting to undefined: " + that.applyKeyStringArray);
            let properBodyVal = that.isProperBody(query.WHERE);
            let properTransformationsVal = that.isProperTransformations(query.TRANSFORMATIONS); // TODO: this line might cause problems!
            let properOptionsVal = that.isProperOptions(query.OPTIONS);
            //*
            // it doesn't return undefined
            // but nice to keep something checking if anything goes astray
            if (typeof properBodyVal === "undefined") {
                throw("undefined occurs inside isProperBody!");
            }
            if (typeof properTransformationsVal === "undefined") {
                throw("undefined occurs inside isProperTransfomrations!");
            }
            if (typeof properOptionsVal === "undefined") {
                throw("undefined occurs inside isProperOptions!");
            }
            //*/

            let the_truth = properBodyVal && properTransformationsVal && properOptionsVal;
            if (!the_truth) {
                console.log("\n\n\nQuery is not completely valid!\n\n\n");
            }
            else {
                console.log("\n\n\nQuery is completely valid!\n\n\n");
            }

            return the_truth;
            // MAKE RETURN ERROR CODE IF INVALID
        } else {
            throw("under checkValidQuery: doesn't have both WHERE and OPTIONS!");
        }
    }
    // uncomment below for raw form of code
    optionsFunction(query:any, inputDataset: any, type: string): any {

        let that = this;
        //let datasetBeforeQuery = that.dataset['courses'];      previous iteration that calls upon the big data set
        let datasetBeforeQuery = inputDataset;                  // now takes inputDataset as a parameter!

        var returningDataset = new Array<any>();
        //console.log("current query in optionsFunction: " + query);
        let columnsWeWant = query["COLUMNS"];

        let arrayOfKeys = new Array<string>();
        for (let columnOption of columnsWeWant) {
            arrayOfKeys.push(columnOption);
        }
        //console.log("keys of columns (from array of keys) is: " + arrayOfKeys);
        let translatedWantList = new Array<string>();

        if (type === "legacy") {
            for(let desiredThings of arrayOfKeys) {
                // put things into dataset
                // grab column from the datasetBeforeQuery, push it on to the returning data set.
                // not sure if this implementation is perfectly correct
                let columnOfDataset = new Array<any>();
                let translatedWants:string = "";
                if (desiredThings === "courses_avg") { translatedWants = "Avg"; }
                else if (desiredThings === "courses_pass") { translatedWants = "Pass"; }
                else if (desiredThings === "courses_fail") { translatedWants = "Fail"; }
                else if (desiredThings === "courses_audit") { translatedWants = "Audit"; }
                else if (desiredThings === "courses_dept") { translatedWants = "Subject"; }
                else if (desiredThings === "courses_id") { translatedWants = "Course"; }
                else if (desiredThings === "courses_instructor") { translatedWants = "Professor"; }
                else if (desiredThings === "courses_title") { translatedWants = "Title"; }
                else if (desiredThings === "courses_uuid") { translatedWants = "id"; }
                else if (desiredThings === "courses_year") { translatedWants = "Year"; }
                else if (desiredThings === "rooms_fullname") { translatedWants = "rooms_fullname"; }
                else if (desiredThings === "rooms_shortname") { translatedWants = "rooms_shortname"; }
                else if (desiredThings === "rooms_number") { translatedWants = "rooms_number"; }
                else if (desiredThings === "rooms_name") { translatedWants = "rooms_name"; }
                else if (desiredThings === "rooms_address") { translatedWants = "rooms_address"; }
                else if (desiredThings === "rooms_lat") { translatedWants = "rooms_lat"; }
                else if (desiredThings === "rooms_lon") { translatedWants = "rooms_lon"; }
                else if (desiredThings === "rooms_seats") { translatedWants = "rooms_seats"; }
                else if (desiredThings === "rooms_type") { translatedWants = "rooms_type"; }
                else if (desiredThings === "rooms_furniture") { translatedWants = "rooms_furniture"; }
                else if (desiredThings === "rooms_href") { translatedWants = "rooms_href"; }

                else {
                    throw("error occurred in optionsFunction. Not any of the listed keys: "+ desiredThings);
                }
                translatedWantList.push(translatedWants);
            }
        }

        else if (type === "d3") {
            translatedWantList = arrayOfKeys;
        }

        //if (translatedWantList.length === arrayOfKeys.length) {
        let wantListLength = arrayOfKeys.length;
        if (typeof datasetBeforeQuery === "undefined") {
            console.log("ERROR IN OPTIONSFUNCTION: datsetBeforeQuery is undefined! (undefined input dataset)");
            throw("ERROR IN OPTIONSFUNCTION: datsetBeforeQuery is undefined! (undefined input dataset)");
        }
        for (let dataObject of datasetBeforeQuery) {
            let returningObject:any = new Object();
            for (let i=0; i<wantListLength; i++) {
                returningObject[arrayOfKeys[i]] = dataObject[translatedWantList[i]];
                // the properties of our original thing would be translated into our returning data set,
                // with the values that we want
            }
            returningDataset.push(returningObject);
        }

        //} else {
        //    console.log("in optionsFunction, translatedWantList is not the same length as arrayOfKeys!");
        //    throw ("in optionsFunction, translatedWantList is not the same length as arrayOfKeys!");
        //}

        if (Object.keys(query).length === 2) {

            //console.log("ORDER is here! parsing with order");
            // put more things in here
            var orderOfData = query.ORDER;      // CAN'T USE LET HERE, DOES WEIRD THINGS ABOUT REFERENCE ERROR
            // ensures that we have a string in our hands
            // console.log("key of order of data: " + orderOfData);

            // SORTING FUNCTION
            // this sort is inspired by Array.prototype.sort() documentation
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

            if (type === "legacy") {
                returningDataset = returningDataset.sort(function(a:any,b:any) {
                    var compareA = a[orderOfData];
                    var compareB = b[orderOfData];
                    if (typeof compareA === "string") {
                        compareA = compareA.toLowerCase();
                        compareB = compareB.toLowerCase();
                        if (compareA > compareB) {
                            return 1;
                        }
                        else if (compareA === compareB) {
                            return 0;
                        }
                        else {
                            return -1;
                        }
                    }
                    return a[orderOfData] - b[orderOfData];
                });
            }

            else if (type === "d3") {
                if (typeof orderOfData !== "string") {
                    let direction = orderOfData["dir"];
                    let keysOfOrder = orderOfData["keys"];
                    returningDataset = that.sortingHelper(returningDataset, direction, keysOfOrder);
                }

                else {
                    // when the d3-type ORDER  is still a string
                    returningDataset = returningDataset.sort(function(a:any,b:any) {
                        var compareA = a[orderOfData];
                        var compareB = b[orderOfData];
                        if (typeof compareA === "string") {
                            compareA = compareA.toLowerCase();
                            compareB = compareB.toLowerCase();
                            if (compareA > compareB) {
                                return 1;
                            }
                            else if (compareA === compareB) {
                                return 0;
                            }
                            else {
                                return -1;
                            }
                        }
                        return a[orderOfData] - b[orderOfData];
                    });
                }


            }


        }
        /*
        var singleReturningObject: any = new Object();
        let i2=0;
        for (let individual of returningDataset) {
            singleReturningObject[i2] = individual;
            i2++;
        }
        console.log("\n\n below is output of singleReturningObject from optionsFunction: \n\n");
        console.log(singleReturningObject);
        console.log("discarded singleReturningObject")
        */
        var finalresult = {result:returningDataset};
        return finalresult;
    };

    sortingHelper(dataset: any, dir: string, keys: any): any {
        // intakes dataset, direction, and keys of decreasing priority
        // outputs a value that is either positive or negative

        let that = this; // for the recursive helper
        let returningDataset = dataset;
        // for (let i = keys.length-1; i>=0; i--) {    //  (let key of keys) (let i = keys.length-1; i>=0; i--)
        // let key = keys[i];
        let i = 0;
        let key = keys[0]; // our priority is on the first search function! Then the rest are secondary, tertiary, ... etc priority
        // new implementation: uses the search thingy for most things, and looks for tiebreakers inside a recursive function!
        returningDataset = returningDataset.sort(function(a:any,b:any) {
            var compareA = a[key];
            var compareB = b[key];
            //if (typeof compareA === "string") {
            // compareA = compareA.toLowerCase();
            // compareB = compareB.toLowerCase();
            if (dir === "UP") {
                if (compareA > compareB) {
                    return 1;
                }
                else if (compareA === compareB) {
                    // return that.sortingHelperHelper(a, b, keys, 1, "UP");
                    for (let i = 1; i<keys.length; i++) {
                        let key2 = keys[i];
                        let aKey = a[key2];
                        let bKey = b[key2];
                        if (aKey > bKey) {
                            return 1;
                        }
                        else if (aKey === bKey) {
                            continue;   // breaks the current iteration of the loop!
                        }
                        else {
                            return -1;
                        }
                    }
                    return 0;
                }
                else {
                    return -1;
                }
            }
            if (dir === "DOWN") {
                if (compareA < compareB) {
                    return 1;
                }
                else if (compareA === compareB) {
                    // return that.sortingHelperHelper(a, b, keys, 1, "DOWN");
                    for (let i = 1; i<keys.length; i++) {
                        let key2 = keys[i];
                        let aKey = a[key2];
                        let bKey = b[key2];
                        if (aKey < bKey) {
                            return 1;
                        }
                        else if (aKey === bKey) {
                            continue;   // breaks the current iteration of the loop!
                        }
                        else {
                            return -1;
                        }
                    }
                    return 0;
                }
                else {
                    return -1;
                }
            }
        });
        // }
        return returningDataset;
    }

    /*
    sortingHelperHelper(a:any, b:any, keys:any, index:number, dir:string):number {
        // intakes elements a and b, and checks for the tiebreaker's keys in decreasing priority!
        // ie checks keys[1] (because main uses keys[0]) first, then if still a tie check keys[2], it still tie then check keys[3], and on and on and on

        let that = this;

        let i = index;
        if (i>=keys.length) {
            // at the end of the keys array, but still equal to each other. Just return an ELSE case.
            return 0;
        }
        let key = keys[i];
        let aKey = a[key];
        let bKey = b[key];
        // do stuff
        if (dir === "UP") {
            if (aKey > bKey) {
                return 1;
            }
            else if (aKey === bKey) {
                return that.sortingHelperHelper(a, b, keys, ++i, "UP");         // ++i because we want to increment before calling!
            }
            else {
                return -1;
            }
        }
        if (dir === "DOWN") {
            if (aKey < bKey) {
                return 1;
            }
            else if (aKey === bKey) {
                return that.sortingHelperHelper(a, b, keys, ++i, "DOWN");
            }
            else {
                return -1;
            }
        }
        // this line shouldn't execute! if it does, then we have undefined as a value!
        console.log("error inside sortingHelperHelper! code is tripping");
        throw("error inside sortingHelperHelper! code is tripping");
        // stub
        // return -1;
    }
    */

    isProperBody(query: any) {
        var that = this;
        // in the WHERE:[] case,
        // the inside is not quite undefined... query has a prototype object!
        // so we combat it by checking to see if length of keys is 0.
        let lengthOfThing = Object.keys(query);
        if (lengthOfThing.length === 0) {
            console.log("WHERE is empty! checkValidQuery returning true for WHERE.")
            return true;
        }
        return that.isProperFilter(query);
    };

    isProperOptions(query:any): boolean {
        var that = this;
        let optionsQuery = query;   // optionsQuery = query.OPTIONS

        //console.log("in optionsQuery");
        let inProperColumn: boolean = that.isProperColumn(optionsQuery["COLUMNS"]);
        let isOrderValid: boolean = true;
        if (Object.keys(optionsQuery).length === 2) {
            // make sure "ORDER" is made correctly
            // console.log("checking whether \"ORDER\" is formed correctly");
            if (Object.keys(optionsQuery)[1] === "ORDER"){
                //console.log("ORDER is here!");
                // let columnsList = Object.keys(optionsQuery["COLUMNS"]);      returns indexes, not values
                let columnsList = new Array<string>();
                for (let columnOption of optionsQuery["COLUMNS"]) {
                    columnsList.push(columnOption);
                }
                // let orderList = Object.keys(optionsQuery["ORDER"]);
                if (!(typeof optionsQuery["ORDER"] === "string")) {  // when we have an object in. ie D3 code
                    let queryOfD3 = optionsQuery["ORDER"];
                    let dirValue = queryOfD3["dir"];
                    let isDirValid:boolean = false;
                    if (typeof dirValue !== "undefined") {
                        isDirValid = that.isProperDir(dirValue);
                    }
                    let keysOfD3 = queryOfD3["keys"];
                    let areKeysValid:boolean = false;
                    if (typeof keysOfD3 !== "undefined") {
                        areKeysValid = true;
                        for (let keys of keysOfD3) {
                            // now this implementation checks to see if the key is contained within columns, if not then it's invalid
                            // resembles skaha better :D
                            areKeysValid = areKeysValid && (columnsList.indexOf(keys) > -1);
                        }
                        if (!areKeysValid) {
                            console.log("there exists at least one false key inside OPTIONS->SORT!");
                        }
                    }

                    isOrderValid = isDirValid && areKeysValid;
                }
                else {
                    // legacy code, fo rd1 and d2 support
                    // for cases where ORDER is a string

                    //if ((that.applyKeyStringArray.length === 0) && (that.groupArray.length === 0)) {
                    let orderThing: string = optionsQuery["ORDER"];
                    let orderingVal = orderThing; // only element
                    isOrderValid = (columnsList.indexOf(orderingVal) > -1); // see if value of "ORDER" comes from "COLUMNS"
                    //} not needed!


                }
            }
            else {
                // console.log("ORDER does not contain just one string!");
                isOrderValid = false;
            }
        }
        if (!isOrderValid) {
            console.log("ORDER is not valid!");
        }
        if (!inProperColumn) {
            console.log("COLUMN is not valid!");
        }
        return inProperColumn && isOrderValid;
    };

    isProperTransformations(query:any):boolean {
        var that = this;
        if (typeof query === "undefined") {
            // base case, TRANSFORMATIONS does not exist
            return true;
        }
        let properGroupVal = that.isProperGroup(query["GROUP"]);
        let properApplyVal = that.isProperApply(query["APPLY"]);
        if (!properGroupVal) {
            console.log("Group did not return true!");
        }
        if (!properApplyVal) {
            console.log("Apply did not return true!");
        }
        return properGroupVal && properApplyVal;
    }

    isProperFilter(query:any): boolean {
        var that = this;
        var keys = Object.keys(query);
        for (let key of keys) {         // (let key of keys)
            if (key === "AND" || key === "OR") {
                var filterCorrect = that.isProperLogicComparison(query[key]);
                if (typeof filterCorrect === "undefined") {
                    throw("undefined isProperLogicComparison detected from isProperFilter!");
                }
                return filterCorrect;
            }
            else if (key === "LT" || key === "GT" || key === "EQ") {
                var filterCorrect = that.isProperMComparison(query[key]);
                if (typeof filterCorrect === "undefined") {
                    throw("undefined isProperMComparison detected from isProperFilter!");
                }
                return filterCorrect;
            }
            else if (key === "IS") {
                var filterCorrect = that.isProperSComparison(query[key]);
                if (typeof filterCorrect === "undefined") {
                    throw("undefined isProperSComparison detected from isProperFilter!");
                }
                return filterCorrect;
            }
            else if (key === "NOT") {
                var filterCorrect = that.isProperNegation(query[key]);
                if (typeof filterCorrect === "undefined") {
                    throw("undefined isProperNegation detected from isProperFilter!");
                }
                return filterCorrect;
            }
            // could input more console.logs if we need to debug
            // what else now? base case? does base case exist? it's a FILTER after all
            else {
                throw("error thrown in isProperFilter! Not any case in FILTER."); // in for now
            }
        }
    };
    isProperLogicComparison(query:any): boolean {
        var that = this;
        var nextQuery = query;
        let keys = Object.keys(query);
        //console.log("in isProperLogicComparison");
        // console.log(nextQuery);
        var atLeastOneFilter = that.isProperFilter(nextQuery[0]);
        for (let i=1; i<nextQuery.length; i++) {
            atLeastOneFilter = atLeastOneFilter && that.isProperFilter(nextQuery[i]);
        }
        return atLeastOneFilter;
    };

    isProperMComparison(query:any) {
        let that = this;
        let nextQuery = query;
        //console.log("in isProperMComparison.");
        // console.log("Our nextQuery is: " + nextQuery);
        let setOfQueryKeys = Object.keys(nextQuery);
        let isMKey = that.isMKey(setOfQueryKeys[0]);
        var isNumber = (typeof nextQuery[setOfQueryKeys[0]] === "number");     // this says nextQuery.m_key, and asks if it's a number
        return isMKey && isNumber;
    };

    isProperSComparison(query:any) {
        // isProperSComparison seems to work fine now!
        var that = this;
        var key: string[] = Object.keys(query);// supposed to be just one
        //console.log("key of isProperSComparison: " + key);
        var stringOfKey: string = key[0];
        if (!that.isSKey(stringOfKey)) {
            // console.log("stringOfKey: " + stringOfKey + ", is not a valid s_key!");
            return false;
        }
        //console.log("stringOfKey of isProperSComparison: " + key);
        var inputString:string = query[stringOfKey];  // gets into { "string" }
        //console.log("inputString value before recursion: " + inputString);
        if (inputString === "") {
            console.log("there is an empty field after s_key! return true");
            return true;
        }
        if(inputString.charAt(0) === "*") {
            if (inputString === "") {
                console.log("there is an empty field after s_key! return true");
                return true;
            }
            if(inputString.charAt(inputString.length - 1) === "*") {
                if (inputString.length === 1) {
                    // means inputString = "*", and after removing things, we check empty string. "" returns true.
                    return true;
                }
                let inputString2 = inputString.substring(1,inputString.length-1);
                //console.log("inputString value as parameter of recursion: " + inputString2);
                return that.isInputString(inputString2);
            }
            let inputString2 = inputString.substring(1);
            //console.log("inputString value as parameter of recursion: " + inputString2);
            return that.isInputString(inputString2);
        }
        else {
            if(inputString.charAt(inputString.length - 1) === "*") {
                let inputString2 = inputString.substring(0, inputString.length-1);
                //console.log("inputString value as parameter of recursion: " + inputString2);
                return that.isInputString(inputString2);
            }
            //console.log("inputString value as parameter of recursion: " + inputString + "(not changed)");
            return that.isInputString(inputString);
        }
    };
    isProperNegation(query:any): boolean {
        var that = this;
        /*
        before I understood, I always assumed that both key and value get passed in for queries!
        So I made this to parse the key first, before getting to value. It doesn't work,
        but I'm leaving it here in case I wonder why I did this later on.
        var key: string[] = Object.keys(query);// supposed to be just one
        console.log("key of isProperNegation: " + key);
        var stringOfKey: string = key[0];
        console.log("stringOfKey of isProperNegation: " + stringOfKey);
        if (stringOfKey === "NOT") {
        */
        var nextQuery = query;
        // console.log("in NOT with " + nextQuery);
        return that.isProperFilter(nextQuery);
    };
    isProperColumn(query:any): boolean {
        var that = this;
        var nextQuery: string[] = query;
        //console.log("Thing under \"COLUMNS\": " + nextQuery);
        if (typeof nextQuery === "undefined") {
            // cannot have empty column! guards against nextQuery.length throwing udefined error
            console.log("COLUMNS undefined under isPropercolumns!");
            return false;
        }
        if (nextQuery.length > 0) {
            let areValidKeys = true;
            //console.log("at least 1 key here in COLUMNS! now checking if valid")
            for (let possibleKey of nextQuery) {
                areValidKeys = areValidKeys && that.isProperD3String(possibleKey);
            }
            return areValidKeys;
        }
        //console.log("no keys detected in COLUMNS!");
        return false;
    };
    isProperKey(str:string): boolean {
        var that = this;
        let properSKey = that.isSKey(str);
        let properMKey = that.isMKey(str);
        if ((properSKey || properMKey) ===true){
            // console.log("key is valid");
            return true;
        }
        else {
            return false;
        }
    };
    isSKey(str:string): any {
        let that = this;
        if (str === "courses_dept" ||
            str === "courses_id" ||
            str === "courses_instructor" ||
            str === "courses_title" ||
            str === "courses_uuid") {
            // console.log("s_key valid for courses!");
            if (that.queryType === "undefined") {
                that.queryType = "courses";
            }
            else if (that.queryType === "rooms") {
                return false;
            }
            //  console.log("value of that.queryType: " + that.queryType);
            return true;
        }
        else if (str === "rooms_fullname" ||
            str === "rooms_shortname" ||
            str === "rooms_number" ||
            str === "rooms_name" ||
            str === "rooms_address" ||
            str === "rooms_type" ||
            str === "rooms_furniture" ||
            str === "rooms_href") {
            // console.log("s_key valid for rooms!");
            if (that.queryType === "undefined") {
                that.queryType = "rooms";
            }
            else if (that.queryType === "courses") {
                return false;
            }
            //console.log("value of that.queryType: " + that.queryType);
            return true;
        }
        else {
            // console.log("s_key invalid / not s_key!");
            return false;
        }
    };
    isMKey(str:string): boolean {
        let that = this;
        if (str === "courses_avg"||
            str === "courses_pass" ||
            str === "courses_fail" ||
            str === "courses_audit" ||
            str === "courses_year") {
            //console.log("m_key valid for courses!");
            if (that.queryType === "undefined") {
                that.queryType = "courses";
            }
            else if (that.queryType === "rooms") {
                return false;
            }
            //console.log("value of that.queryType: " + that.queryType);
            return true;
        }
        else if (str === "rooms_lat" ||
            str === "rooms_lon" ||
            str === "rooms_seats") {
            //console.log("m_key valid for rooms!");
            if (that.queryType === "undefined") {
                that.queryType = "rooms";
            }
            else if (that.queryType === "courses") {
                return false;
            }
            //console.log("value of that.queryType: " + that.queryType);
            return true;
        }
        else {
            //console.log("m_key invalid!");
            return false;
        }
    };
    isInputString(str:string): boolean {
        //console.log("checking if string, " + str + ", is valid...");
        if (str.length > 0) {
            for (let i=0; i<str.length; i++) {
                if(str.charAt(i) === "*") {
                    //console.log("invalid character in string: " + str);
                    return false;
                }
            }
            //console.log("string is valid!");
            return true;
        }
        //console.log("string has length 0!");
        return false;
    };

    isProperGroup(keys:any):boolean {
        // intakes a number of keys, and checks if they are all proper
        let that = this;
        let isThereProperKeys:boolean = false;
        let isAllKeysProper:boolean = true;
        for (let key of keys) {
            isAllKeysProper = isAllKeysProper && that.isProperKey(key);
            if(that.isProperKey(key)) {
                that.groupArray.push(key);
            }
            // because this runs at least once if keys is not empty, we can say there is at least one possible key thing here.
            isThereProperKeys = true;
        }
        if (!isAllKeysProper) {
            console.log("not all keys in GROUP are valid!");
        }
        if (!isThereProperKeys) {
            console.log("there are no keys in GROUP!");
        }
        return isAllKeysProper && isThereProperKeys;
    }

    isProperApply(query:any):boolean {
        // takes in 0, 1, or many APPLYKEYs, and returns true if they are all valid

        let that = this;

        // this is to check to see if APPLY: [ (empty) ]
        if (typeof query === "undefined") {
            return true;
        }
        // now that this is propably fine, let's run through all the APPLYKEYs inside!
        let isAllValid:boolean = true;
        for (let applyKey of query) {
            isAllValid = isAllValid && that.isProperApplykey(applyKey);
        }
        if (!isAllValid) {
            console.log("not all APPLYKEYs are valid in isProperApply!");
        }
        return isAllValid;
    }

    isProperApplykey(query:any):boolean {
        // stub
        // uses isProperTString
        // and isProperApplytoken
        // and isProperKey
        let that = this;
        // console.log("not familiar with data structure. Going to console.log first");
        // console.log(query);
        let isStringValid:boolean = false;
        let isApplytokenValid:boolean = false;
        let isKeyValid:boolean = false;
        // console.log("inside isProperApplykey: query is");
        // console.log(query);
        let queryArrayHolder = Object.keys(query);
        if (queryArrayHolder.length > 1) {
            console.log("invalid query response in isProperApplyKey! supposed to have single element, not 2.");
            return false;
        }
        for (let string in query) {
            // should be just one string, if there's more then this shouldn't be able to detect it...
            console.log("there should be just one run of this loop, in isProperApplykey.");
            isStringValid = that.isProperTString(string);
            let objectOfApplykey = query[string];
            if (objectOfApplykey.length > 1) {
                console.log("invalid query response in inner loop of isProperApplyKey!");
                return false;
            }
            for (let applytoken in objectOfApplykey) {
                console.log("aand this operation should run only once as well (different from the other one-liner). under same function");
                console.log("value of applytoken: " + applytoken);
                isApplytokenValid = that.isProperApplytoken(applytoken);
                if (isApplytokenValid) {
                    if (applytoken === "MAX" ||
                        applytoken === "MIN" ||
                        applytoken === "AVG" ||
                        applytoken === "SUM") {
                        isKeyValid = that.isMKey(objectOfApplykey[applytoken]);
                    }
                    else if (applytoken === "COUNT") {
                        isKeyValid = that.isProperKey(objectOfApplykey[applytoken]);
                    }
                    else {
                        throw("something is wrong in isProperApplykey!");
                    }
                }
            }
        }
        if (!(isStringValid && isApplytokenValid && isKeyValid)) {
            console.log("returned false in isProperApplykey!");
        }
        return isStringValid && isApplytokenValid && isKeyValid;
    }

    isProperApplytoken(str:string):boolean {
        if (str === "MAX" ||
            str === "MIN" ||
            str === "AVG" ||
            str === "COUNT" ||
            str === "SUM") {
            // console.log("applytoken " + str + " is alright");
            return true;
        }
        else {
            console.log(str + " is not an applytoken!");
            return false;
        }
    }

    isProperTString(str:string):boolean {
        // intakes a Transformation string, from applykey
        // if it is in correct format (no "_"s), then push the string onto global array, and return true
        let that = this;

        // console.log("checking if string, " + str + ", is valid TString...");
        if (str.length > 0) {
            for (let i=0; i<str.length; i++) {
                if(str.charAt(i) === "_") {
                    console.log("invalid character in Tstring: " + str);
                    return false;
                }
            }
            console.log("Tstring is valid!");
            if (!(that.applyKeyStringArray.indexOf(str) > -1)) {
                that.applyKeyStringArray.push(str);
            }
            else {
                console.log("there is a duplicate string for APPLYKEY")
                return false;
            }

            console.log("value of applyKeyStringArray (stored in CVQ): " + that.applyKeyStringArray);
            return true;
        }
        console.log("Tstring has length 0!");       // not too sure about this...
        return false;
    }

    isProperDir(str:string):boolean {
        // checks to see if direction is an acceptable one
        // intakes string, outputs boolean

        if (str === "UP" ||
            str === "DOWN") {
            // our only 2 cases for valid directions
            return true;
        }
        return false;
    }

    isProperD3String(str:string):boolean {
        // checks to see if what we want qualifies as a string
        let that = this;

        if ((that.applyKeyStringArray.length === 0) && (that.groupArray.length === 0)) {
            // if these 2 arrays are empty, then we have no TRANSFORMATION involved.
            // use D2 code!

            return that.isProperKey(str);
        }

        return (that.containsKey(str, "applykey") || that.containsKey(str, "groupkey"));
    }

    containsKey(str:string, type:string):boolean {
        // intakes a string, and checks if it is contained by either ApplyKeyStringArray or groupArray
        let that = this;
        let arrayToUse:string[] = [];
        if (type === "applykey") { arrayToUse = that.applyKeyStringArray; }
        if (type === "groupkey") { arrayToUse = that.groupArray; }
        for (let stringy of arrayToUse) {
            if (str === stringy) {
                return true;
            }
        }
        return false;
    }


}


//zip = new_zip
// new_zip.folder("courses").forEach(function (relativePath: any, file: any) {
//    console.log("iterating over", relativePath);
//    console.log(file)
//
//     file.async("string").then(function success(result:any){
//       //  console.log(result)
//
//         //console.log(pArr)
//
//     })
//         console.log(pArr)
//
//
//
// });


/**
 * use this for validation if necessary
 //var listofcourses = jobject['result']
 //console.log(listofcourses[1])
 // for(let i = 0; i < listofcourses.length;i++)
 // {  if (listofcourses[i].hasProperty("Title")&&
//     listofcourses[i].hasProperty("Professor")&&
//     listofcourses[i].hasProperty("Course")&&
//     listofcourses[i].hasProperty("Fail")&&
//     listofcourses[i].hasProperty("Pass")&&
//     listofcourses[i].hasProperty("Audit")&&
//     listofcourses[i].hasProperty("id")&&
//     listofcourses[i].hasProperty("Subject")&&
//     listofcourses[i].hasProperty("Avg")){
//     return jobject
//
// }
//
// }
 **/


// molestIndexHelper (index:any){
//     var that = this;
//     //console.log(index)
//     var count = 1;
//     if (typeof  index['childNodes'] !== "undefined"){
//         //console.log(count)
//         var currentstage = index['childNodes']
//         for(let i in currentstage){
//
//             if (currentstage[i]['nodeName'] === 'html'){
//                 //console.log(currentstage[i]['nodeName'])
//                 that.molestIndexHelper(currentstage[i]);
//             }
//             if (currentstage[i]['nodeName'] === 'body'){
//                 //console.log('found body');
//                 that.molestIndexHelper(currentstage[i]);
//             }
//
//             if (currentstage[i]['nodeName'] === 'div'){
//                 that.molestIndexHelper(currentstage[i]);
//             }
//
//             if (currentstage[i]['nodeName'] === 'section'){
//                 that.molestIndexHelper(currentstage[i]);
//             }
//             if(currentstage[i]['nodeName'] === 'table'){
//                 //console.log('yoyo');
//                 that.molestIndexHelper(currentstage[i])
//             }
//             if(currentstage[i]['nodeName'] === 'tbody'){
//                 console.log('I like to be naked')
//                 var unprocessedinfo=[];
//                 unprocessedinfo = currentstage[i]['childNodes'];
//                 //console.log(unprocessedinfo);
//             }
//
//         }
//
//
//     }
// };

// Promise.all(pArr).then(function(troll:Array<any>){
//     /** this is what I got so for
//      *  the valid building list below and lat lon hardcode version below **/
//     var infoindexarray:Array<any> = that.infoFromIndex(troll);
//     var usefulbuilding:Array<any> = that.getTheFilteredBuildings(troll,infoindexarray);
//     // console.log(usefulbuilding);
//     //var listoflatlon:Array<any> = [];
//
//     that.putLatLonInList(infoindexarray).then(function (firstlastaddresslatlonlist) {
//
//         //console.log(firstlastaddresslatlonlist);
//         that.dataset[id] = firstlastaddresslatlonlist;
//         that.addeddataset  = {};
//         that.addeddataset[id] = firstlastaddresslatlonlist;
//         console.log(firstlastaddresslatlonlist);
//         that.outputDataSetToDisk(id,that.addeddataset);
//         fulfill({
//             "code": 204, "body": {"success": "the operation was successful and the id was new"}
//         });
//     })
//         .catch(function (err){
//             reject('putLatLonInListProblem')
//         })
//
//
//     //that.putLatLonInList(infoindexarray)
//     // console.log(usefulbuilding);
//
//
//     //console.log(usefulbuilding);
// })

// getTheFilteredBuildings(troll:any, infoindexarray:Array<any>){
//     var that = this;
//
//     var unfilteredarray:Array<any> = that.unprocessBuildingFiles(troll);
//     var filteredarray:Array<any> = [];
//
//     for (let x of infoindexarray) {
//         //console.log(x);
//         var fullnamecheck = x['rooms_fullname'];
//         var addresscheck = x['rooms_address'];
//         //  console.log (fullnamecheck + addresscheck);
//
//         for (let building of unfilteredarray) {
//             if (that.checkIfBuilidngValidByMatchingFullNameAndAddress(building, fullnamecheck)
//                 && that.checkIfBuilidngValidByMatchingFullNameAndAddress(building, addresscheck)) {
//                 //console.log('trolltech is very troll');
//                 filteredarray.push(building);
//             }
//         }
//     }
//     return filteredarray;
// };

// infoFromIndex(troll:Array<any>){
//
//     for (let x in troll){
//         if (troll[x].length >0 ){
//             return troll[x];
//         }
//
//     }
// };
//
// unprocessBuildingFiles(troll:Array<any>){
//     var that = this;
//     var unfilterarray:Array<any> = [];
//     for (let x in troll){
//         //console.log(troll[x].length);
//         if (typeof troll[x].length === 'undefined' ){
//             unfilterarray.push(troll[x]);
//             //console.log(troll[x].length)
//         }
//     }
//     console.log(unfilterarray.length);
//     return unfilterarray ;
// };

// checkIfBuilidngValidByMatchingFullNameAndAddress(building: any, nameoraddress:string): any {
//     let that = this;
//
//     /*
//     if (htmlObject.constructor === Array) {
//         for (let subElement of htmlObject) {
//             let result = that.traverser(subElement);
//             if (result !== null) {
//                 return result;
//             }
//         }
//     }
//     */
//     // if there is nothing left, we return null
//     if (building === null || building === undefined) {
//         return null;
//     }
//
//     // if we finally hit what we want, we return the contents of tbody
//     if (building['value'] === nameoraddress ) {
//         // do something
//         console.log("buildingfullnameoraddress found! finally...");
//         //console.log("building value: " + building);
//         return true;
//     }
//
//     // if we don't hit neither, do more recursion
//     else {
//         var children = building["childNodes"];
//         if (children === undefined) {
//             return null;
//         }
//         // console.log(children);
//         for (let child of children) {
//             let result = that.checkIfBuilidngValidByMatchingFullNameAndAddress(child, nameoraddress);
//             if (result !== null) {
//                 return result;
//             }
//         }
//         if (children.length === 0) {
//             // console.log("this case was overlooked by for-loop! children's value is: " + children);
//             // console.log(children);
//             // console.log("\nchildren's type is: " + typeof children);
//             return null; // safeguards against cases where childNodes = array[0] and/or other weird stuff!
//         }
//         // console.log("The h2 was not found within this array of children in htmlObject.");
//         // console.log("value/structure of htmlObject: " + building);
//         return null; // <----------- apparently I need this, or else it doesn't work... weird!
//         // I need it because this is where nothing is found inside these branches
//     }
// }