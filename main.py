################################# IMPORTS #####################################
import sys
from warnings import warn
import pdb

import tornado
from tornado.web import url # constructs a URLSpec for you
# handlers
from tornado.web import RedirectHandler
from tornado.web import RequestHandler
from tornado.web import StaticFileHandler
# other
from tornado.web import Application


################################## MAIN #######################################


class BaseHandler (RequestHandler):


	def initialize(self):
		#init stuff!
		pass
	def get(self):
		print(str(self.request))
		print()
		print(self.request.host)


class StaticCachelessFileHandler(StaticFileHandler):


	def set_extra_headers(self, path):
		# Disable cache
		self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')


def make_app():
	return Application(
		[
			url('/', RedirectHandler, { "url": "vidquiz.html" }, name = "rootme"),
			url('/(.*)', StaticCachelessFileHandler, { "path": "." }), # captures anything at all, and serves it as a static file. simple!
		],
		# settings:
		debug = True,
	)

def make_app_and_start_listening():
	#enable_pretty_logging()
	application = make_app()
	application.listen(8686)
	# other stuff
	tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
	make_app_and_start_listening()

