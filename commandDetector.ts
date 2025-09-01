import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export interface CommandPaths {
    node: string;
    claude: string;
    isWSL?: boolean;
    wslPrefix?: string[];
}

export class CommandDetector {
    private static cachedPaths: CommandPaths | null = null;

    static detectCommands(nodeOverride?: string, claudeOverride?: string): CommandPaths {
        // If we have overrides, don't use cache
        if (nodeOverride || claudeOverride) {
            const platform = os.platform();
            const isWindows = platform === 'win32';
            
            if (isWindows && this.isWSLAvailable()) {
                // On Windows with WSL, detect inside WSL or use overrides
                return {
                    node: nodeOverride || this.detectNodeInWSL(),
                    claude: claudeOverride || this.detectClaudeInWSL(),
                    isWSL: true,
                    wslPrefix: ['wsl']
                };
            } else if (isWindows && !this.isWSLAvailable()) {
                // Windows without WSL is not supported
                throw new Error('WSL is required on Windows. Please install WSL to use this plugin.');
            } else {
                // Use overrides if provided, otherwise detect (macOS/Linux)
                return {
                    node: nodeOverride || this.detectNode(),
                    claude: claudeOverride || this.detectClaude(),
                    isWSL: false
                };
            }
        }
        
        if (this.cachedPaths) {
            return this.cachedPaths;
        }

        const platform = os.platform();
        const isWindows = platform === 'win32';
        
        if (isWindows && this.isWSLAvailable()) {
            // On Windows with WSL, detect commands inside WSL environment
            const nodePath = this.detectNodeInWSL();
            const claudePath = this.detectClaudeInWSL();
            
            this.cachedPaths = {
                node: nodePath,
                claude: claudePath,
                isWSL: true,
                wslPrefix: ['wsl']
            };
        } else if (isWindows && !this.isWSLAvailable()) {
            // Windows without WSL is not supported
            throw new Error('WSL is required on Windows. Please install WSL to use this plugin.');
        } else {
            // Normal detection for macOS/Linux
            const nodePath = this.detectNode();
            const claudePath = this.detectClaude();

            this.cachedPaths = {
                node: nodePath,
                claude: claudePath,
                isWSL: false
            };
        }

        return this.cachedPaths;
    }

    private static isWSLAvailable(): boolean {
        try {
            execSync('wsl --status', { encoding: 'utf8' });
            return true;
        } catch {
            return false;
        }
    }

    private static detectNodeInWSL(): string {
        try {
            // Try to find node using which inside WSL
            const result = execSync('wsl -- which node', { encoding: 'utf8' }).trim();
            if (result) {
                return result;
            }
        } catch {}

        // Try common Linux node paths inside WSL
        const commonPaths = [
            '/usr/local/bin/node',
            '/usr/bin/node',
            '~/.nvm/current/bin/node',
            '/usr/local/nodejs/bin/node'
        ];

        for (const nodePath of commonPaths) {
            try {
                const testResult = execSync(`wsl -- test -f ${nodePath} && echo "exists"`, { encoding: 'utf8' }).trim();
                if (testResult === 'exists') {
                    return nodePath;
                }
            } catch {}
        }

        // Try to find nvm versions
        try {
            const nvmVersions = execSync('wsl -- ls -1 ~/.nvm/versions/node/ 2>/dev/null | sort -V | tail -1', { encoding: 'utf8' }).trim();
            if (nvmVersions) {
                const latestNodePath = `~/.nvm/versions/node/${nvmVersions}/bin/node`;
                const testResult = execSync(`wsl -- test -f ${latestNodePath} && echo "exists"`, { encoding: 'utf8' }).trim();
                if (testResult === 'exists') {
                    return latestNodePath;
                }
            }
        } catch {}

        return 'node'; // Fallback to just 'node' if nothing else works
    }

    private static detectClaudeInWSL(): string {
        try {
            // Try to find claude using which inside WSL
            const result = execSync('wsl -- which claude', { encoding: 'utf8' }).trim();
            if (result) {
                return result;
            }
        } catch {}

        // Try common Linux claude paths inside WSL
        const commonPaths = [
            '/usr/local/bin/claude',
            '~/.claude/local/node_modules/.bin/claude',
            '~/.npm-global/bin/claude',
            '~/.local/share/npm/bin/claude'
        ];

        for (const claudePath of commonPaths) {
            try {
                const testResult = execSync(`wsl -- test -f ${claudePath} && echo "exists"`, { encoding: 'utf8' }).trim();
                if (testResult === 'exists') {
                    return claudePath;
                }
            } catch {}
        }

        // Try to find claude in global npm prefix
        try {
            const npmPrefix = execSync('wsl -- npm config get prefix', { encoding: 'utf8' }).trim();
            if (npmPrefix) {
                const globalClaudePath = `${npmPrefix}/bin/claude`;
                const testResult = execSync(`wsl -- test -f ${globalClaudePath} && echo "exists"`, { encoding: 'utf8' }).trim();
                if (testResult === 'exists') {
                    return globalClaudePath;
                }
            }
        } catch {}

        return 'claude'; // Fallback to just 'claude' if nothing else works
    }

    private static detectNode(): string {
        try {
            const result = execSync('which node', { encoding: 'utf8' }).trim();
            return result || 'node';
        } catch {
            const commonPaths = this.getCommonNodePaths();
            
            for (const nodePath of commonPaths) {
                if (fs.existsSync(nodePath)) {
                    return nodePath;
                }
            }
            
            return 'node';
        }
    }

    private static detectClaude(): string {
        try {
            const result = execSync('which claude', { encoding: 'utf8' }).trim();
            return result || this.findClaudeInNodeModules();
        } catch {
            return this.findClaudeInNodeModules();
        }
    }

    private static findClaudeInNodeModules(): string {
        const homeDir = os.homedir();
        const claudePaths = this.getCommonClaudePaths(homeDir);
        
        for (const claudePath of claudePaths) {
            if (fs.existsSync(claudePath)) {
                return claudePath;
            }
        }
        
        const globalNpmPrefix = this.getGlobalNpmPrefix();
        if (globalNpmPrefix) {
            const globalClaudePath = path.join(globalNpmPrefix, 'bin', 'claude');
            
            if (fs.existsSync(globalClaudePath)) {
                return globalClaudePath;
            }
        }
        
        return 'claude';
    }

    private static getGlobalNpmPrefix(): string | null {
        try {
            return execSync('npm config get prefix', { encoding: 'utf8' }).trim();
        } catch {
            return null;
        }
    }

    private static getCommonNodePaths(): string[] {
        const platform = os.platform();
        const homeDir = os.homedir();
        const paths: string[] = [];
        
        if (platform === 'darwin') {
            paths.push(
                '/usr/local/bin/node',
                '/opt/homebrew/bin/node',
                '/usr/bin/node',
                path.join(homeDir, '.nvm', 'current', 'bin', 'node')
            );
        } else {
            // Linux and other Unix-like systems
            paths.push(
                '/usr/local/bin/node',
                '/usr/bin/node',
                path.join(homeDir, '.nvm', 'current', 'bin', 'node')
            );
        }
        
        // Add nvm versions for both macOS and Linux
        const nvmVersionsPath = path.join(homeDir, '.nvm', 'versions', 'node');
        if (fs.existsSync(nvmVersionsPath)) {
            try {
                const versions = fs.readdirSync(nvmVersionsPath).sort().reverse();
                for (const version of versions) {
                    paths.push(path.join(nvmVersionsPath, version, 'bin', 'node'));
                }
            } catch {}
        }
        
        return paths;
    }

    private static getCommonClaudePaths(homeDir: string): string[] {
        // Only Unix paths since this is only called for macOS/Linux (Windows uses WSL detection)
        const paths: string[] = [
            path.join(homeDir, '.claude', 'local', 'node_modules', '.bin', 'claude'),
            '/usr/local/lib/node_modules/.bin/claude',
            '/usr/local/bin/claude',
            path.join(homeDir, '.npm-global', 'bin', 'claude'),
            path.join(homeDir, '.local', 'share', 'npm', 'bin', 'claude')
        ];
        
        return paths;
    }

    static clearCache(): void {
        this.cachedPaths = null;
    }
}