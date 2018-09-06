# Build a binary for just the current platform
all:
	node_modules/.bin/pkg jtl.js -o bin/jtl

# Build binaries for all different platforms
release:
	node_modules/.bin/pkg -t node10-linux,node10-win,node10-macos jtl.js -o bin/jtl

# Delete all the built binaries
clean:
	rm bin/jtl*
