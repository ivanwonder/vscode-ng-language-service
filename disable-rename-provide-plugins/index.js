/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 function init(modules) {
    const ts = modules.typescript;
    function create(info) {
        // Diagnostic logging
        info.project.projectService.logger.info("I'm getting set up now! Check the log for this message.");
        // Set up decorator object
        const proxy = Object.create(null);
        for (let k of Object.keys(info.languageService)) {
            const x = info.languageService[k];
            // @ts-expect-error - JS runtime trickery which is tricky to type tersely
            proxy[k] = (...args) => x.apply(info.languageService, args);
        }
        // Remove specified entries from completion list
        function isAngularCore(path) {
            return path.endsWith('@angular/core/core.d.ts');
        }
        proxy.getRenameInfo = (fileName, position) => {
            const angularCore = info.project.getFileNames().find(isAngularCore);
            if(angularCore) {
                return {
                    canRename: false,
                    localizedErrorMessage: "disable the rename provide and should be provide by angular extension",
                };
            } else {
                return info.languageService.getRenameInfo(fileName, position)
            }
        };
        return proxy;
    }
    return { create };
}
module.exports = init
