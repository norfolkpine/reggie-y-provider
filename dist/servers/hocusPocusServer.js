var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { Server } from '@hocuspocus/server';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { fetchDocument } from '../api/getDoc.js';
import { getMe } from '../api/getMe.js';
import { logger } from '../utils.js';
export var hocusPocusServer = Server.configure({
    name: 'docs-collaboration',
    timeout: 30000,
    quiet: true,
    onConnect: function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var roomParam, can_edit, document_1, error_1, user, _c;
            var requestHeaders = _b.requestHeaders, connection = _b.connection, documentName = _b.documentName, requestParameters = _b.requestParameters, context = _b.context, request = _b.request;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        roomParam = requestParameters.get('room');
                        if (documentName !== roomParam) {
                            logger('Invalid room name - Probable hacking attempt:', documentName, requestParameters.get('room'));
                            logger('UA:', request.headers['user-agent']);
                            logger('URL:', request.url);
                            return [2 /*return*/, Promise.reject(new Error('Wrong room name: Unauthorized'))];
                        }
                        if (!uuidValidate(documentName) || uuidVersion(documentName) !== 4) {
                            logger('Room name is not a valid uuid:', documentName);
                            return [2 /*return*/, Promise.reject(new Error('Wrong room name: Unauthorized'))];
                        }
                        can_edit = false;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetchDocument(documentName, requestHeaders)];
                    case 2:
                        document_1 = _d.sent();
                        if (!document_1.abilities.retrieve) {
                            logger('onConnect: Unauthorized to retrieve this document', documentName);
                            return [2 /*return*/, Promise.reject(new Error('Wrong abilities:Unauthorized'))];
                        }
                        can_edit = document_1.abilities.update;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _d.sent();
                        if (error_1 instanceof Error) {
                            logger('onConnect: backend error', error_1.message);
                        }
                        return [2 /*return*/, Promise.reject(new Error('Backend error: Unauthorized'))];
                    case 4:
                        connection.readOnly = !can_edit;
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, getMe(requestHeaders)];
                    case 6:
                        user = _d.sent();
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        context.userId = user.id;
                        return [3 /*break*/, 8];
                    case 7:
                        _c = _d.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        logger('Connection established on room:', documentName, 'canEdit:', can_edit);
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    },
});
