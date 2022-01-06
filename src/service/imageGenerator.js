const fs = require('fs-extra');
const uuid = require('uuid').v4;
const marked = require('marked');
const md5 = require('js-md5');
const artTemplate = require('art-template');
const fonts = require('../../env.json').image_fonts;


class ImageGenerator {
    constructor(puppeteer) {
        this.puppeteer = puppeteer;
        artTemplate.defaults.imports.parseInt = parseInt;
        artTemplate.defaults.imports.btoa = (str) => Buffer.from(str).toString('base64');
        artTemplate.defaults.imports.JSON = JSON;
    }

    async generateFromHtmlFile(htmlname, options){
        options = options || {};
        let configs = {
            size: options['size'] || [800,600],
            selector: options['selector'] || undefined,
        }
        let url = `file://${htmlname}`;
        const page = await this.puppeteer.newPage();
        await page.setViewport({
            width: configs['size'][0],
            height: configs['size'][1]
        });
        await page.setDefaultNavigationTimeout(0)
        await page.goto(url, {
            timeout: 0,
            waitUntil: [
                'load'
            ]
         });
        await page.evaluate(`document.querySelector('body').style.fontFamily = "${fonts || "'Noto Sans SC', sans-serif, 'consolas'"}"`);
        let imagename = `${process.cwd()}/storage/images/${uuid()}.png`;
        let element = configs['selector'] ? await page.$(configs['selector']): page;
        if(configs.selector) {
            await element.screenshot({path: imagename});
        }else{
            await element.screenshot({path: imagename, fullPage: true});
        }
        await page.close();
        return imagename;
    }

    async generateFromHtml(html, options){
        options = options || {};
        let configs = {
            size: options['size'] || [800,600],
            selector: options['selector'] || undefined
        }
        let redis_key = `HtmlImage:${md5(html)}`;
        let imagename = await bot.redis.get(redis_key);
        if(imagename != null && await fs.exists(imagename)) {
            return imagename;
        }
        if(options.extraCss){
            html += `<style>${options.extraCss}</style>`;
        }
        let htmlname = `${process.cwd()}/storage/htmls/${uuid()}.html`;
        await fs.outputFile(htmlname, html);
        imagename = await this.generateFromHtmlFile(htmlname, configs);
        await bot.redis.set(redis_key, imagename);
        return imagename;
    }

    async generateFromTemplateFile(template, data, options){
        let filename = `${process.cwd()}/src/templates/${template}.html`;
        let html_content = await fs.readFile(filename, {encoding: 'utf8'});
        let render_content = artTemplate.render(`<div id="template">${html_content}</div>`, data);
        if(options) {
            if(!options.selector) {
                options.selector = '#template'
            }
        }else{
            options = {selector: '#template'}
        }
        return await this.generateFromHtml(render_content, options);
    }

    async MarkdownFileExist(template) {
        let filename = `${process.cwd()}/src/templates/${template}.markdown`;
        return await fs.exists(filename);
    }

    async generateFromMarkdownFile(template, options){
        let filename = `${process.cwd()}/src/templates/${template}.markdown`;
        let markdown = await fs.readFile(filename, {encoding: 'utf8'});
        return await this.generateFromMarkdown(markdown, options);
    }

    async generateFromMarkdown(markdown, options){
        let marked_content = `<div id="template">${marked(markdown)}</div>`;
        if(options) {
            options.selector = '#template'
        }else{
            options = {selector: '#template'}
        }
        return await this.generateFromHtml(marked_content, options);
    }

    async generateFromArrayTable(array, options){
        let markdown = '';
        markdown = `| ${array[0].join(' | ')} |\n|${array[0].map(() => '---').join(' | ')} |`;
        array.shift();
        for(let i in array) {
            markdown += `\n| ${array[i].map(x => String(x).replace(/\|/g, '\\|')).join(' | ')} |`;
        }
        let extraCss = 'th{padding:8px;line-height:1.42857143;text-align:left;vertical-align:bottom;border-bottom:2px solid #ddd;border-top:0;display:table-cell;font-weight:bold}table{border-spacing:0;border-collapse:collapse;display:table;width:100%;max-width:100%}tr{display:table-row;vertical-align:inherit;border-color:inherit}td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd;display:table-cell}';
        if(options) {
            if(options.title) {
                markdown = `## ${options.title} \n` + markdown;
            }
            if(options.tail) {
                markdown += `\n---\n${options.tail}`
            }
            if(options.extraCss){
                options.extraCss += extraCss;
            }else{
                options.extraCss = extraCss;
            }
        }else{
            options = {extraCss: extraCss}
        }
        return await this.generateFromMarkdown(markdown, options);
    }

    async getFromUrl(url, options){
        options = options || {};
        let configs = {
            size: options['size'] || [800,600],
            selector: options['selector'] || undefined,
            evaluate: options['evaluate'] || undefined
        }
        const page = await this.puppeteer.newPage();
        if(!configs['selector']){
            await page.setViewport({
                width: configs['size'][0],
                height: configs['size'][1]
            });
        }
        await page.goto(url, {
            timeout: 0,
            waitUntil: [
                'domcontentloaded'
            ]
        });
        if(configs.evaluate) {
            page.evaluate(configs['evaluate']);
        }
        let element = configs['selector'] ? await page.$(configs['selector']) : page;
        if(element == null) {
            throw '错误：抓取不到需要的内容'
        }
        let imagename = `${process.cwd()}/storage/images/${uuid()}.png`;
        await element.screenshot({path: imagename});
        await page.close();
        return imagename;
    }
}

module.exports = ImageGenerator;
