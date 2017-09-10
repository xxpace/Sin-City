var exp = module.exports;


exp.createUID = function()
{
	let str = String(Date.now());
	return str.substr(str.length-10);
}