import * as joi from "joi"

export default joi.object({
    token : joi.string(),
    expires_in : joi.number()
})