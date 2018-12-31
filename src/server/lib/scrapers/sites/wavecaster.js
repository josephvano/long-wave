"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hash = require("object-hash");
var agent = require("superagent");
var cheerio = require("cheerio");
var utils_1 = require("../../utils");
var DayRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s?(.*)$/;
var ForecastRating = /** @class */ (function () {
    function ForecastRating() {
    }
    return ForecastRating;
}());
var Forecast = /** @class */ (function () {
    function Forecast(values) {
        Object.assign(this, values);
    }
    Forecast.prototype.toHash = function () {
        return hash(this);
    };
    return Forecast;
}());
exports.Forecast = Forecast;
var WavecasterScraper = /** @class */ (function () {
    function WavecasterScraper() {
        this.url = "https://www.thewavecaster.com/";
    }
    WavecasterScraper.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, agent.get(this.url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.text];
                }
            });
        });
    };
    WavecasterScraper.prototype.parse = function (body) {
        var _this = this;
        var $ = cheerio.load(body);
        var tables = $("table");
        var summary = "", forecasts;
        if (tables.length > 1) {
            summary = utils_1.strip(tables.first().text());
            forecasts = tables
                .eq(1)
                .find("tr")
                .map(function (index, el) {
                var text = utils_1.strip($(el).text());
                return {
                    day: _this._parseForecastDay(text),
                    rating: _this._parseForecastRating(el),
                    summary: _this._parseForecastSummary(text)
                };
            }).get();
        }
        var images = $(".LayoutContainer div div div div:nth-child(3)")
            .first()
            .children("img")
            .get()
            .map(function (el) { return el.attribs['src']; });
        return new Forecast({
            summary: summary,
            images: images,
            forecasts: forecasts
        });
    };
    WavecasterScraper.prototype._parseForecastDay = function (content) {
        var result = content.match(DayRegex);
        if (result) {
            return result[1];
        }
        return "Unknown";
    };
    WavecasterScraper.prototype._parseForecastRating = function (content) {
        var rating = "#007f00";
        cheerio(content).find("font").map(function (ix, element) {
            var day = cheerio(element).text();
            var result = day.match(DayRegex);
            if (result) {
                rating = element.attribs["color"];
            }
        }).get();
        switch (rating) {
            case "#007f00":
                return "Poor";
            case "#bf5f00":
                return "Fair";
            case "#bf0000":
                return "Good";
            default:
                return "Poor";
        }
    };
    WavecasterScraper.prototype._parseForecastSummary = function (content) {
        var result = content.match(DayRegex);
        if (result && result.length > 1) {
            return result[2];
        }
        return "";
    };
    return WavecasterScraper;
}());
exports.WavecasterScraper = WavecasterScraper;
